using System.Diagnostics;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Views
{
    public partial class SettingsView : UserControl
    {
        private bool loading = true;

        public event EventHandler? StateChanged;

        public SettingsView()
        {
            InitializeComponent();

            backupSettingToggle.Checked = Settings.Current.BackupBeforeApply;
            confirmSettingToggle.Checked = Settings.Current.ConfirmWarnings;
            startupSettingToggle.Checked = Settings.Current.StartWithWindows;
            loading = false;
        }

        private void OnBackupSettingChanged(object? sender, EventArgs e) =>
            Store(() => Settings.Current.BackupBeforeApply = backupSettingToggle.Checked);

        private void OnConfirmSettingChanged(object? sender, EventArgs e) =>
            Store(() => Settings.Current.ConfirmWarnings = confirmSettingToggle.Checked);

        private void OnStartupSettingChanged(object? sender, EventArgs e) =>
            Store(() =>
            {
                Settings.Current.StartWithWindows = startupSettingToggle.Checked;
                Settings.Current.ApplyStartup();
            });

        private void Store(Action change)
        {
            if (loading) return;
            change();
            Settings.Current.Save();
        }

        private async void OnRescanClick(object? sender, EventArgs e)
        {
            rescanActionButton.Enabled = false;
            await Task.Run(TweakCatalog.Refresh);
            rescanActionButton.Enabled = true;

            StateChanged?.Invoke(this, EventArgs.Empty);
            await Dialogs.Message(ParentForm!, $"{TweakCatalog.EnabledCount} optimizations are currently applied.", "Scan complete");
        }

        private async void OnRevertAllClick(object? sender, EventArgs e)
        {
            var enabled = TweakCatalog.Tweaks.Where(t => t.Enabled && !t.OneWay).ToList();
            if (enabled.Count == 0)
            {
                await Dialogs.Message(ParentForm!, "Nothing to revert.", "Revert all");
                return;
            }

            if (!await Dialogs.Confirm(ParentForm!, $"Revert {enabled.Count} applied optimizations?", "Revert all")) return;

            revertActionButton.Enabled = false;
            await Task.Run(() =>
            {
                foreach (var tweak in enabled)
                {
                    TweakEngine.Run(tweak, false);
                    tweak.Enabled = false;
                }
            });
            revertActionButton.Enabled = true;

            StateChanged?.Invoke(this, EventArgs.Empty);
            await Dialogs.Message(ParentForm!, $"Reverted {enabled.Count} optimizations.", "Revert all");
        }

        private void OnOpenFolderClick(object? sender, EventArgs e) =>
            Process.Start(new ProcessStartInfo(AppPaths.Data) { UseShellExecute = true });
    }
}
