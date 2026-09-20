using Molnar_Free_Tweaking_Utility.Controls;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Views
{
    public partial class BackupView : UserControl
    {
        public event EventHandler? BackupRestored;

        public BackupView()
        {
            InitializeComponent();
            Reload();
        }

        public void Reload()
        {
            listPanel.SuspendLayout();
            listPanel.Controls.Clear();

            foreach (var backup in BackupService.List())
            {
                var row = new BackupRow { Backup = backup };
                row.RestoreRequested += OnRestoreRequested;
                row.DeleteRequested += OnDeleteRequested;
                listPanel.Controls.Add(row);
            }

            listPanel.ResumeLayout();
            emptyLabel.Visible = listPanel.Controls.Count == 0;
            scrollBar.Visible = listPanel.VerticalScroll.Visible;
        }

        public Backup CreateBackup() => BackupService.Create();

        private async void OnCreateClick(object? sender, EventArgs e)
        {
            createButton.Enabled = false;
            var backup = await Task.Run(BackupService.Create);
            createButton.Enabled = true;

            Reload();
            await Dialogs.Message(ParentForm!, $"Captured {backup.Entries.Count} registry values.", "Backup created");
        }

        private async void OnRestoreRequested(object? sender, Backup backup)
        {
            if (!await Dialogs.Confirm(ParentForm!,
                $"Restore every value captured on {backup.Created:dd MMM yyyy HH:mm}?", "Restore backup")) return;

            int restored = await Task.Run(() => BackupService.Restore(backup));
            BackupRestored?.Invoke(this, EventArgs.Empty);
            await Dialogs.Message(ParentForm!, $"Restored {restored} registry values.", "Backup restored");
        }

        private async void OnDeleteRequested(object? sender, Backup backup)
        {
            if (!await Dialogs.Confirm(ParentForm!, "Delete this backup permanently?", "Delete backup")) return;

            BackupService.Delete(backup);
            Reload();
        }
    }
}
