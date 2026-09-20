using System.Reflection;
using System.Text.Json;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public static class TweakCatalog
    {
        public static IReadOnlyList<Tweak> Tweaks { get; } = Load();

        public static int EnabledCount => Tweaks.Count(t => t.Enabled);

        public static void Refresh()
        {
            foreach (var tweak in Tweaks) tweak.Enabled = TweakEngine.IsApplied(tweak);
        }

        private static List<Tweak> Load()
        {
            using var stream = Assembly.GetExecutingAssembly()
                .GetManifestResourceStream("Molnar_Free_Tweaking_Utility.Resources.tweaks.json");
            if (stream is null) return [];

            var tweaks = JsonSerializer.Deserialize<List<Tweak>>(stream) ?? [];
            foreach (var tweak in tweaks) tweak.Enabled = TweakEngine.IsApplied(tweak);
            return tweaks;
        }
    }
}
