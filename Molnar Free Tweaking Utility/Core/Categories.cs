using Molnar_Free_Tweaking_Utility.Properties;

namespace Molnar_Free_Tweaking_Utility.Core
{
    public sealed record CategoryInfo(string Key, string Display, Color Color, Image Icon);

    public static class Categories
    {
        public static readonly CategoryInfo[] All =
        [
            new("performance",           "Performance",   Color.FromArgb( 96, 112, 239), Resources.Bolt),
            new("warning",               "Warning",       Color.FromArgb(253,   6,  87), Resources.Warning),
            new("latency",               "Latency",       Color.FromArgb( 96, 255, 114), Resources.Stopwatch),
            new("network",               "Network",       Color.FromArgb( 54, 239, 208), Resources.Wifi),
            new("security",              "Security",      Color.FromArgb(190, 174, 255), Resources.Shield),
            new("temperature",           "Temperature",   Color.FromArgb(255,  92,  92), Resources.Temperature),
            new("customization",         "Customization", Color.FromArgb(255, 149,  83), Resources.Eye),
            new("privacy_cleanup",       "Cleanup",       Color.FromArgb( 86, 204, 242), Resources.Broom),
            new("privacy_over_security", "Privacy",       Color.FromArgb(255, 206,  84), Resources.Detective),
            new("data_collection",       "Telemetry",     Color.FromArgb(120, 200, 160), Resources.Database),
            new("program_configuration", "Programs",      Color.FromArgb(255, 143, 222), Resources.Console),
            new("misc",                  "Misc",          Color.FromArgb(160, 152, 214), Resources.Asterisk)
        ];

        public static CategoryInfo? Find(string key) => All.FirstOrDefault(c => c.Key == key);
    }
}
