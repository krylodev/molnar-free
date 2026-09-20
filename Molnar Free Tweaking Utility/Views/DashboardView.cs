using System.Diagnostics;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Views
{
    public partial class DashboardView : UserControl
    {
        public event EventHandler? BackupRequested;
        public event EventHandler? OptimizeRequested;

        public DashboardView()
        {
            InitializeComponent();

            processorValue.Content = SystemInfo.Processor;
            graphicsValue.Content = SystemInfo.GraphicsCard;
            totalOptimizationsValue.Content = TweakCatalog.Tweaks.Count.ToString();

            benchmarkCardButton.Enabled = false;
            UpdateCounters();
        }

        public void UpdateCounters() => enabledOptimizationsValue.Content = TweakCatalog.EnabledCount.ToString();

        private void OnDiscordClick(object? sender, EventArgs e) => Links.Open(Links.Discord);

        private void OnChangelogClick(object? sender, EventArgs e) => Links.Open(Links.Changelog);

        private void OnUpgradeClick(object? sender, EventArgs e) => Links.Open(Links.Premium);

        private void OnBackupClick(object? sender, EventArgs e) => BackupRequested?.Invoke(this, EventArgs.Empty);

        private void OnOptimizeClick(object? sender, EventArgs e) => OptimizeRequested?.Invoke(this, EventArgs.Empty);

        private async void OnBenchmarkClick(object? sender, EventArgs e) =>
            await Dialogs.Message(ParentForm!, "Benchmarking is available in Molnar Premium.", "Premium feature");
    }

    public static class Links
    {
        public const string Discord = "https://discord.gg/molnarsoftwares";
        public const string Changelog = "https://github.com/krylodev/molnar-free";
        public const string Premium = "https://molnarsoftwares.cc";
        public const string Website = "https://molnarsoftwares.cc";

        public static void Open(string url)
        {
            try { Process.Start(new ProcessStartInfo(url) { UseShellExecute = true }); }
            catch (Exception) { }
        }
    }
}
