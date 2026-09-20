using System.ComponentModel;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Controls
{
    public partial class BackupRow : UserControl
    {
        private Backup? backup;

        public event EventHandler<Backup>? RestoreRequested;
        public event EventHandler<Backup>? DeleteRequested;

        public BackupRow()
        {
            InitializeComponent();
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public Backup? Backup
        {
            get => backup;
            set
            {
                backup = value;
                if (value is null) return;

                titleLabel.Content = value.Created.ToString("dd MMMM yyyy  ·  HH:mm");
                subtitleLabel.Content = $"{value.Entries.Count} registry values captured on {value.Machine}";
            }
        }

        private void OnRestoreClick(object? sender, EventArgs e)
        {
            if (backup is not null) RestoreRequested?.Invoke(this, backup);
        }

        private void OnDeleteClick(object? sender, EventArgs e)
        {
            if (backup is not null) DeleteRequested?.Invoke(this, backup);
        }
    }
}
