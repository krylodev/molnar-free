namespace Molnar_Free_Tweaking_Utility.Controls
{
    partial class CategoryChip
    {
        private System.ComponentModel.IContainer components = null;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        private void InitializeComponent()
        {
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            components = new System.ComponentModel.Container();
            surface = new Guna.UI2.WinForms.Guna2Panel();
            icon = new CuoreUI.Controls.cuiPictureBox();
            tooltip = new CuoreUI.Components.cuiTooltipHover(components);
            surface.SuspendLayout();
            SuspendLayout();
            //
            // surface
            //
            surface.BorderColor = Color.FromArgb(28, 28, 36);
            surface.BorderRadius = 9;
            surface.BorderThickness = 1;
            surface.Controls.Add(icon);
            surface.CustomizableEdges = customizableEdges1;
            surface.Dock = DockStyle.Fill;
            surface.FillColor = Color.FromArgb(17, 17, 22);
            surface.Location = new Point(0, 0);
            surface.Name = "surface";
            surface.ShadowDecoration.CustomizableEdges = customizableEdges2;
            surface.Size = new Size(30, 30);
            surface.TabIndex = 0;
            //
            // icon
            //
            icon.BackColor = Color.Transparent;
            icon.Content = null;
            icon.ImageTint = Color.FromArgb(96, 112, 239);
            icon.Location = new Point(7, 7);
            icon.Name = "icon";
            icon.OutlineThickness = 0F;
            icon.PanelOutlineColor = Color.Transparent;
            icon.Rotation = 0;
            icon.Rounding = new Padding(0);
            icon.Size = new Size(16, 16);
            icon.TabIndex = 0;
            //
            // tooltip
            //
            tooltip.BackColor = Color.FromArgb(22, 22, 28);
            tooltip.Content = "";
            tooltip.ForeColor = Color.FromArgb(247, 243, 244);
            tooltip.TargetControl = surface;
            tooltip.TooltipPosition = CuoreUI.Components.cuiTooltipHover.Position.Top;
            tooltip.TooltipPositionOffset = new Size(0, 6);
            //
            // CategoryChip
            //
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.Transparent;
            Controls.Add(surface);
            Margin = new Padding(0, 0, 8, 0);
            Name = "CategoryChip";
            Size = new Size(30, 30);
            surface.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private Guna.UI2.WinForms.Guna2Panel surface;
        private CuoreUI.Controls.cuiPictureBox icon;
        private CuoreUI.Components.cuiTooltipHover tooltip;
    }
}
