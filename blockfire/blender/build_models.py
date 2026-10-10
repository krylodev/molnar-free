"""Builds Blockfire's low-poly models in Blender and exports them as GLB.

Run it with Blender:
    blender --background --python blender/build_models.py
or with the bpy module from PyPI (pip install bpy):
    python blender/build_models.py

Output goes to public/models/:
    character.glb  the player avatar, split into parts the game animates
    weapons.glb    rifle, sniper and shotgun
    props.glb      map props (barrels, trees, rocks, containers, ...)

Models use vertex colors and a single material each, so they render in one
draw call per mesh with no textures. Parts on the "Accent" material are
tinted with each player's color in game.

Coordinates in this file are written in game space (x right, y up, the
model faces -z) and converted to Blender's z-up space when built, so the
numbers line up with the game's hitboxes and colliders.
"""

import math
import os
import random

import bpy  # must come first: the bpy module registers bmesh and mathutils
import bmesh
from mathutils import Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'public', 'models'))


# --- helpers -------------------------------------------------------------------

def rgba(hex_color):
    return ((hex_color >> 16 & 255) / 255, (hex_color >> 8 & 255) / 255, (hex_color & 255) / 255, 1.0)


def shade(hex_color, k):
    """Scales a color's brightness by k."""
    r = min(255, int((hex_color >> 16 & 255) * k))
    g = min(255, int((hex_color >> 8 & 255) * k))
    b = min(255, int((hex_color & 255) * k))
    return (r << 16) | (g << 8) | b


def to_blender(x, y, z):
    """Game space (y up, -z forward) to Blender space (z up)."""
    return (x, -z, y)


def placement(loc, rx=0.0, ry=0.0, scale=(1, 1, 1)):
    """Matrix placing a primitive at a game-space location with a pitch
    (rx, about x) and yaw (ry, about the vertical axis)."""
    sx, sy, sz = scale
    rot = Matrix.Rotation(ry, 4, 'Z') @ Matrix.Rotation(rx, 4, 'X')
    return Matrix.Translation(to_blender(*loc)) @ rot @ Matrix.Diagonal((sx, sz, sy, 1))


class Part:
    """Collects colored primitives into one mesh object."""

    def __init__(self, name):
        self.name = name
        self.bm = bmesh.new()
        self.color = self.bm.loops.layers.color.new('Col')
        self.painted = self.bm.faces.layers.int.new('painted')

    def _paint(self, color):
        for face in self.bm.faces:
            if face[self.painted]:
                continue
            face[self.painted] = 1
            c = rgba(color(face) if callable(color) else color)
            for loop in face.loops:
                loop[self.color] = c

    def _bevel(self, verts, amount):
        if amount <= 0:
            return
        edges = list({e for v in verts for e in v.link_edges})
        bmesh.ops.bevel(self.bm, geom=edges, offset=amount, segments=1, profile=0.5,
                        affect='EDGES', clamp_overlap=True)

    def box(self, size, loc, color, bevel=0.0, rx=0.0, ry=0.0):
        res = bmesh.ops.create_cube(self.bm, size=1.0, matrix=placement(loc, rx, ry, size))
        self._bevel(res['verts'], bevel)
        self._paint(color)
        return self

    def cylinder(self, radius, length, loc, color, axis='y', segments=8, radius_top=None, rx=0.0, ry=0.0):
        """Cylinder (or cone, with radius_top) along a game-space axis."""
        # Blender cones run along z (game y); tip them over for the other axes
        rot_x = rx + (0.0 if axis == 'y' else math.pi / 2)
        rot_y = ry + (math.pi / 2 if axis == 'x' else 0.0)
        bmesh.ops.create_cone(
            self.bm, cap_ends=True, cap_tris=False, segments=segments,
            radius1=radius, radius2=radius if radius_top is None else radius_top,
            depth=length, matrix=placement(loc, rot_x, rot_y))
        self._paint(color)
        return self

    def blob(self, radius, loc, color, scale=(1, 1, 1), jitter=0.0, seed=1):
        """Lumpy low-poly sphere for rocks and snow."""
        rng = random.Random(seed)
        res = bmesh.ops.create_icosphere(self.bm, subdivisions=1, radius=radius,
                                         matrix=placement(loc, scale=scale))
        if jitter:
            for v in res['verts']:
                v.co.x += rng.uniform(-jitter, jitter)
                v.co.y += rng.uniform(-jitter, jitter)
                v.co.z += rng.uniform(-jitter, jitter) * 0.6
        self._paint(color)
        return self

    def build(self, parent=None, loc=(0, 0, 0), material='Vertex'):
        self.bm.faces.layers.int.remove(self.painted)
        self.bm.normal_update()
        mesh = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(mesh)
        self.bm.free()
        obj = bpy.data.objects.new(self.name, mesh)
        bpy.context.scene.collection.objects.link(obj)
        obj.data.materials.append(get_material(material))
        obj.parent = parent
        obj.location = to_blender(*loc)
        return obj


def empty(name, parent=None, loc=(0, 0, 0)):
    obj = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(obj)
    obj.parent = parent
    obj.location = to_blender(*loc)
    return obj


def get_material(name):
    mat = bpy.data.materials.get(name)
    if mat:
        return mat
    mat = bpy.data.materials.new(name)
    if not mat.node_tree:
        mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get('Principled BSDF')
    attr = nodes.new('ShaderNodeVertexColor')
    attr.layer_name = 'Col'
    mat.node_tree.links.new(attr.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 0.9
    return mat


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def export(filename):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, filename)
    wanted = dict(
        filepath=path, export_format='GLB', export_yup=True, export_apply=True,
        export_materials='EXPORT', export_vertex_color='MATERIAL', export_all_vertex_colors=False,
        export_normals=True,
        export_texcoords=False, export_animations=False, export_cameras=False,
        export_lights=False, export_extras=False,
    )
    available = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
    bpy.ops.export_scene.gltf(**{k: v for k, v in wanted.items() if k in available})
    print(f'exported {path}')


# --- palette -------------------------------------------------------------------

SKIN = 0xe9c39b
DARK = 0x1a1d22
GUNMETAL = 0x2b2f36
STEEL = 0x4a505a
PANTS = 0x2d3440
GEAR = 0x3c4636
GLASS = 0x1b2a3a
GLOW = 0x6fd6ff
ACCENT = 0xffffff  # tinted per player in game
WOOD = 0x7a4a26


# --- character -------------------------------------------------------------------
# Feet at the origin, facing -z, 1.8 m tall. The head occupies 1.4-1.8 m to
# match the head hitbox. Pivots: legs at the hips, head at the neck and arms
# at the shoulders so the game can swing and aim them.

def build_character():
    reset_scene()
    root = empty('Character')
    body = empty('Body', root)

    for name, side in (('LegL', -1), ('LegR', 1)):
        leg = Part(name)
        leg.box((0.22, 0.6, 0.24), (0, -0.3, 0), PANTS, bevel=0.02)
        leg.box((0.2, 0.12, 0.06), (0, -0.42, -0.13), shade(PANTS, 0.7))
        leg.box((0.25, 0.18, 0.34), (0, -0.71, -0.04), DARK, bevel=0.03)
        leg.build(body, (side * 0.13, 0.8, 0))

    upper = empty('Upper', body)

    torso = Part('Torso')
    torso.box((0.56, 0.14, 0.3), (0, 0.86, 0), DARK)
    torso.box((0.5, 0.5, 0.28), (0, 1.12, 0), shade(PANTS, 1.1))
    torso.box((0.42, 0.46, 0.16), (0, 1.12, 0.24), GEAR, bevel=0.02)
    torso.box((0.3, 0.1, 0.12), (0, 0.98, 0.3), shade(GEAR, 0.8))
    torso.box((0.12, 0.12, 0.06), (-0.14, 1.0, -0.19), shade(GEAR, 0.8))
    torso.box((0.12, 0.12, 0.06), (0.14, 1.0, -0.19), shade(GEAR, 0.8))
    torso.build(upper)

    vest = Part('TorsoAccent')
    vest.box((0.6, 0.42, 0.32), (0, 1.17, 0), ACCENT, bevel=0.03)
    vest.box((0.18, 0.1, 0.3), (-0.31, 1.37, 0), shade(ACCENT, 0.85))
    vest.box((0.18, 0.1, 0.3), (0.31, 1.37, 0), shade(ACCENT, 0.85))
    vest.build(upper, material='Accent')

    head = Part('Head')
    head.box((0.18, 0.08, 0.18), (0, 0.04, 0), SKIN)
    head.box((0.34, 0.3, 0.34), (0, 0.2, 0), SKIN, bevel=0.03)
    head.box((0.33, 0.1, 0.04), (0, 0.22, -0.17), GLASS)
    head.box((0.29, 0.02, 0.045), (0, 0.25, -0.17), GLOW)
    head_obj = head.build(upper, (0, 1.4, 0))

    helmet = Part('HeadAccent')
    helmet.box((0.4, 0.14, 0.4), (0, 0.35, 0.01), ACCENT, bevel=0.04)
    helmet.box((0.42, 0.04, 0.1), (0, 0.29, -0.2), shade(ACCENT, 0.8))
    helmet.box((0.06, 0.12, 0.06), (0.2, 0.32, 0.08), shade(ACCENT, 0.7))
    helmet.build(head_obj, material='Accent')

    arms = empty('Arms', upper, (0, 1.32, 0))
    skin = Part('ArmsSkin')
    skin.box((0.13, 0.13, 0.18), (0.3, -0.06, -0.3), SKIN)
    skin.box((0.14, 0.14, 0.12), (0.3, -0.06, -0.44), DARK)
    skin.box((0.13, 0.13, 0.22), (-0.18, -0.08, -0.4), SKIN, ry=-0.25)
    skin.box((0.14, 0.14, 0.12), (-0.13, -0.08, -0.54), DARK, ry=-0.25)
    skin.build(arms)
    sleeves = Part('ArmsAccent')
    sleeves.box((0.16, 0.16, 0.3), (0.3, -0.06, -0.08), ACCENT)
    sleeves.box((0.16, 0.16, 0.26), (-0.24, -0.08, -0.16), ACCENT, ry=-0.25)
    sleeves.build(arms, material='Accent')
    empty('GunSocket', arms, (0.16, -0.02, -0.45))

    export('character.glb')


# --- weapons ----------------------------------------------------------------------
# Grip at the origin, barrel toward -z, a "<Name>Muzzle" empty at the tip.

def build_weapons():
    reset_scene()

    rifle = Part('Rifle')
    rifle.box((0.08, 0.11, 0.42), (0, 0.03, -0.15), GUNMETAL, bevel=0.01)
    rifle.box((0.075, 0.085, 0.28), (0, 0.035, -0.48), shade(GUNMETAL, 1.3), bevel=0.01)
    rifle.box((0.078, 0.02, 0.2), (0, 0.076, -0.48), 0xffb400)
    rifle.cylinder(0.018, 0.22, (0, 0.05, -0.72), DARK, axis='z', segments=6)
    rifle.cylinder(0.026, 0.06, (0, 0.05, -0.84), DARK, axis='z', segments=6)
    rifle.box((0.04, 0.02, 0.36), (0, 0.095, -0.2), DARK)
    rifle.box((0.05, 0.05, 0.08), (0, 0.13, -0.12), DARK)
    rifle.box((0.035, 0.03, 0.01), (0, 0.135, -0.165), 0xff4a4a)
    rifle.box((0.05, 0.17, 0.09), (0, -0.09, -0.21), shade(GUNMETAL, 0.8), rx=0.15)
    rifle.box((0.05, 0.12, 0.06), (0, -0.07, 0.0), DARK, rx=-0.25)
    rifle.box((0.06, 0.1, 0.22), (0, 0.01, 0.17), shade(GUNMETAL, 1.3), bevel=0.01)
    rifle.box((0.065, 0.13, 0.03), (0, 0.0, 0.29), DARK)
    r = rifle.build()
    empty('RifleMuzzle', r, (0, 0.05, -0.88))

    sniper = Part('Sniper')
    green = 0x3b4a3a
    sniper.box((0.07, 0.1, 0.5), (0, 0.03, -0.15), green, bevel=0.01)
    sniper.cylinder(0.02, 0.55, (0, 0.05, -0.67), DARK, axis='z', segments=6)
    sniper.cylinder(0.03, 0.09, (0, 0.05, -0.98), DARK, axis='z', segments=6)
    sniper.cylinder(0.035, 0.32, (0, 0.15, -0.18), GUNMETAL, axis='z', segments=8)
    sniper.cylinder(0.046, 0.07, (0, 0.15, -0.36), GUNMETAL, axis='z', segments=8)
    sniper.cylinder(0.042, 0.05, (0, 0.15, -0.01), GUNMETAL, axis='z', segments=8)
    sniper.cylinder(0.039, 0.006, (0, 0.15, -0.397), 0x66ccff, axis='z', segments=8)
    sniper.box((0.03, 0.06, 0.03), (0, 0.1, -0.1), DARK)
    sniper.box((0.03, 0.06, 0.03), (0, 0.1, -0.26), DARK)
    sniper.box((0.09, 0.02, 0.02), (0.06, 0.06, -0.02), 0x9aa0a6)
    sniper.box((0.05, 0.12, 0.06), (0, -0.06, 0.0), DARK, rx=-0.25)
    sniper.box((0.065, 0.12, 0.3), (0, 0.0, 0.24), green, bevel=0.01)
    sniper.box((0.06, 0.04, 0.14), (0, 0.075, 0.2), shade(green, 0.8))
    sniper.box((0.067, 0.02, 0.12), (0, -0.04, 0.27), 0xffb400)
    s = sniper.build()
    empty('SniperMuzzle', s, (0, 0.05, -1.04))

    shotgun = Part('Shotgun')
    shotgun.box((0.085, 0.11, 0.3), (0, 0.02, -0.08), GUNMETAL, bevel=0.01)
    shotgun.cylinder(0.024, 0.5, (0, 0.065, -0.47), STEEL, axis='z', segments=8)
    shotgun.cylinder(0.02, 0.4, (0, 0.015, -0.42), GUNMETAL, axis='z', segments=8)
    shotgun.box((0.08, 0.07, 0.18), (0, 0.015, -0.42), WOOD, bevel=0.012)
    shotgun.box((0.015, 0.015, 0.015), (0, 0.095, -0.7), 0xffd27a)
    shotgun.box((0.05, 0.12, 0.06), (0, -0.07, 0.03), shade(WOOD, 0.8), rx=-0.25)
    shotgun.box((0.07, 0.11, 0.26), (0, -0.005, 0.2), WOOD, bevel=0.012)
    shotgun.box((0.072, 0.12, 0.025), (0, -0.01, 0.33), DARK)
    g = shotgun.build()
    empty('ShotgunMuzzle', g, (0, 0.065, -0.73))

    export('weapons.glb')


# --- props ------------------------------------------------------------------------
# Each prop sits on the ground at its origin. Sizes match the colliders in
# shared/props.js.

def build_props():
    reset_scene()
    rng = random.Random(7)
    vary = lambda base, amt=0.08: (lambda f: shade(base, 1 + rng.uniform(-amt, amt)))

    for name, color in (('barrel', 0xc0392b), ('barrel_blue', 0x2f6fb0)):
        p = Part(name)
        p.cylinder(0.4, 1.1, (0, 0.55, 0), color, segments=10)
        p.cylinder(0.415, 0.06, (0, 0.25, 0), shade(color, 0.65), segments=10)
        p.cylinder(0.415, 0.06, (0, 0.85, 0), shade(color, 0.65), segments=10)
        p.cylinder(0.12, 0.03, (0.18, 1.11, 0.0), shade(color, 0.5), segments=6)
        p.build()

    for name, leaf, snow in (('pine', 0x2f6b3a, None), ('pine_snow', 0x2f5e45, 0xf4f8fb)):
        p = Part(name)
        p.cylinder(0.18, 1.3, (0, 0.65, 0), 0x6b4a2b, segments=6)
        tiers = ((1.3, 1.6, 1.9), (1.0, 1.4, 2.8), (0.65, 1.1, 3.6))
        for i, (radius, height, y) in enumerate(tiers):
            p.cylinder(radius, height, (0, y, 0), shade(leaf, 1 + i * 0.12), segments=7, radius_top=0.05,
                       ry=i * 0.4)
            if snow:
                p.cylinder(radius * 0.55, height * 0.45, (0, y + height * 0.3, 0), snow, segments=7,
                           radius_top=0.04, ry=i * 0.4)
        p.build()

    for name, color, seed in (('rock', 0x8a8f96, 3), ('rock_sand', 0xc9a46b, 5)):
        p = Part(name)
        p.blob(0.85, (0, 0.5, 0), vary(color, 0.12), scale=(1.0, 0.75, 0.92), jitter=0.16, seed=seed)
        p.blob(0.45, (0.55, 0.25, 0.35), vary(shade(color, 0.92), 0.1), jitter=0.08, seed=seed + 1)
        p.build()

    p = Part('cactus')
    cg = 0x4f8f3a
    p.cylinder(0.22, 2.1, (0, 1.05, 0), cg, segments=8)
    p.cylinder(0.22, 0.16, (0, 2.18, 0), shade(cg, 1.1), segments=8, radius_top=0.1)
    p.cylinder(0.13, 0.38, (-0.34, 1.15, 0), shade(cg, 0.95), axis='x', segments=6)
    p.cylinder(0.13, 0.6, (-0.5, 1.45, 0), shade(cg, 0.95), segments=6, radius_top=0.1)
    p.cylinder(0.12, 0.32, (0.3, 0.85, 0), shade(cg, 0.9), axis='x', segments=6)
    p.cylinder(0.12, 0.5, (0.44, 1.1, 0), shade(cg, 0.9), segments=6, radius_top=0.09)
    p.build()

    p = Part('lamp')
    p.box((0.35, 0.25, 0.35), (0, 0.125, 0), 0x3b3f45)
    p.cylinder(0.07, 3.3, (0, 1.85, 0), 0x3b3f45, segments=6)
    p.box((0.06, 0.06, 0.6), (0, 3.4, -0.27), 0x3b3f45)
    p.box((0.28, 0.12, 0.4), (0, 3.35, -0.55), GUNMETAL, bevel=0.02)
    p.box((0.22, 0.02, 0.32), (0, 3.285, -0.55), 0xfff2b0)
    p.build()

    p = Part('sandbags')
    bag = 0xb79a6a
    for row, (y, count, offset) in enumerate(((0.14, 4, 0.0), (0.42, 4, 0.0), (0.7, 3, 0.3))):
        for i in range(count):
            x = -0.9 + i * 0.6 + offset
            p.box((0.58, 0.28, 0.68), (x, y, 0), vary(bag, 0.1), bevel=0.07)
    p.build()

    p = Part('pallet')
    plank = 0xa77a4a
    for i in range(5):
        p.box((1.2, 0.03, 0.18), (0, 0.135, -0.5 + i * 0.25), vary(plank))
    for x in (-0.5, 0, 0.5):
        p.box((0.12, 0.09, 1.2), (x, 0.075, 0), shade(plank, 0.8))
    for i in range(3):
        p.box((1.2, 0.03, 0.18), (0, 0.015, -0.5 + i * 0.5), shade(plank, 0.75))
    p.build()

    for name, color in (('container_red', 0xb03a2e), ('container_blue', 0x2f5f9e), ('container_green', 0x3d7a4a)):
        p = Part(name)
        p.box((5.9, 2.5, 2.4), (0, 1.3, 0), color)
        dark = shade(color, 0.75)
        for i in range(19):
            x = -2.7 + i * 0.3
            for z in (-1.22, 1.22):
                p.box((0.1, 2.3, 0.05), (x, 1.3, z), dark)
        for x in (-2.95, 2.95):
            for z in (-1.2, 1.2):
                p.box((0.12, 2.6, 0.12), (x, 1.3, z), shade(color, 0.55))
            p.box((0.12, 0.12, 2.5), (x, 2.54, 0), shade(color, 0.55))
            p.box((0.12, 0.12, 2.5), (x, 0.06, 0), shade(color, 0.55))
        for z in (-0.6, -0.2, 0.2, 0.6):
            p.box((0.04, 2.2, 0.04), (2.98, 1.3, z), 0x9aa0a6)
        p.box((0.02, 2.3, 0.02), (2.96, 1.3, 0), shade(color, 0.5))
        p.build()

    p = Part('snowman')
    snow = 0xf4f8fb
    p.blob(0.5, (0, 0.45, 0), vary(snow, 0.03), jitter=0.04, seed=11)
    p.blob(0.36, (0, 1.08, 0), vary(snow, 0.03), jitter=0.03, seed=12)
    p.blob(0.26, (0, 1.55, 0), vary(snow, 0.03), jitter=0.02, seed=13)
    p.cylinder(0.05, 0.28, (0, 1.56, -0.36), 0xff7a1a, axis='z', segments=5, radius_top=0.005)
    for x in (-0.09, 0.09):
        p.box((0.05, 0.05, 0.03), (x, 1.64, -0.24), DARK)
    for y in (0.95, 1.1, 1.25):
        p.box((0.05, 0.05, 0.03), (0, y, -0.35), DARK)
    p.cylinder(0.2, 0.04, (0, 1.78, 0), DARK, segments=8)
    p.cylinder(0.13, 0.22, (0, 1.9, 0), DARK, segments=8)
    p.build()

    export('props.glb')


if __name__ == '__main__':
    build_character()
    build_weapons()
    build_props()
