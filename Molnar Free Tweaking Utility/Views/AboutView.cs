using System.Reflection;
using System.Text;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Views
{
    public partial class AboutView : UserControl
    {
        public AboutView()
        {
            InitializeComponent();

            versionLabel.Content = $"Free edition  ·  Version {Assembly.GetExecutingAssembly().GetName().Version?.ToString(3)}";
            systemLabel.Text = BuildSystemSummary();
        }

        private static string BuildSystemSummary()
        {
            var rows = new (string Label, string Value)[]
            {
                ("Operating system", SystemInfo.OperatingSystem),
                ("Processor", SystemInfo.Processor),
                ("Graphics card", SystemInfo.GraphicsCard),
                ("Memory", SystemInfo.Memory),
                ("Optimizations available", TweakCatalog.Tweaks.Count.ToString()),
                ("Optimizations applied", TweakCatalog.EnabledCount.ToString())
            };

            var builder = new StringBuilder();
            foreach (var (label, value) in rows)
                builder.Append($"<span color=\"#616068\">{label}</span>&nbsp;&nbsp;&nbsp;{value}<br>");
            return builder.ToString();
        }

        private void OnDiscordClick(object? sender, EventArgs e) => Links.Open(Links.Discord);

        private void OnPremiumClick(object? sender, EventArgs e) => Links.Open(Links.Premium);

        private void AboutView_Load(object sender, EventArgs e)
        {

        }
    }
}
