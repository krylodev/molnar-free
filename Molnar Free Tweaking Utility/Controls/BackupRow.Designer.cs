namespace Molnar_Free_Tweaking_Utility.Controls
{
    partial class BackupRow
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
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges5 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges6 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges7 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges8 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            surface = new Guna.UI2.WinForms.Guna2Panel();
            deleteButton = new Guna.UI2.WinForms.Guna2Button();
            restoreButton = new Guna.UI2.WinForms.Guna2Button();
            subtitleLabel = new CuoreUI.Controls.cuiLabel();
            titleLabel = new CuoreUI.Controls.cuiLabel();
            badge = new Guna.UI2.WinForms.Guna2Panel();
            icon = new CuoreUI.Controls.cuiPictureBox();
            surface.SuspendLayout();
            badge.SuspendLayout();
            SuspendLayout();
            //
            // surface
            //
            surface.BorderColor = Color.FromArgb(28, 28, 36);
            surface.BorderRadius = 10;
            surface.BorderThickness = 1;
            surface.Controls.Add(deleteButton);
            surface.Controls.Add(restoreButton);
            surface.Controls.Add(subtitleLabel);
            surface.Controls.Add(titleLabel);
            surface.Controls.Add(badge);
            surface.CustomizableEdges = customizableEdges1;
            surface.Dock = DockStyle.Fill;
            surface.FillColor = Color.FromArgb(13, 13, 16);
            surface.Location = new Point(0, 0);
            surface.Name = "surface";
            surface.ShadowDecoration.CustomizableEdges = customizableEdges2;
            surface.Size = new Size(940, 68);
            surface.TabIndex = 0;
            //
            // deleteButton
            //
            deleteButton.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            deleteButton.Animated = true;
            deleteButton.BorderColor = Color.FromArgb(38, 38, 50);
            deleteButton.BorderRadius = 8;
            deleteButton.BorderThickness = 1;
            deleteButton.Cursor = Cursors.Hand;
            deleteButton.CustomizableEdges = customizableEdges5;
            deleteButton.DisabledState.BorderColor = Color.FromArgb(28, 28, 36);
            deleteButton.DisabledState.CustomBorderColor = Color.FromArgb(28, 28, 36);
            deleteButton.DisabledState.FillColor = Color.FromArgb(17, 17, 22);
            deleteButton.DisabledState.ForeColor = Color.FromArgb(70, 70, 78);
            deleteButton.FillColor = Color.FromArgb(22, 22, 28);
            deleteButton.Font = new Font("Poppins", 8F);
            deleteButton.ForeColor = Color.FromArgb(150, 150, 160);
            deleteButton.HoverState.BorderColor = Color.FromArgb(80, 20, 44);
            deleteButton.HoverState.FillColor = Color.FromArgb(52, 16, 30);
            deleteButton.HoverState.ForeColor = Color.FromArgb(253, 6, 87);
            deleteButton.Location = new Point(830, 17);
            deleteButton.Name = "deleteButton";
            deleteButton.PressedColor = Color.FromArgb(52, 16, 30);
            deleteButton.ShadowDecoration.CustomizableEdges = customizableEdges6;
            deleteButton.Size = new Size(94, 34);
            deleteButton.TabIndex = 4;
            deleteButton.Text = "Delete";
            deleteButton.TextAlign = HorizontalAlignment.Center;
            deleteButton.Click += OnDeleteClick;
            //
            // restoreButton
            //
            restoreButton.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            restoreButton.Animated = true;
            restoreButton.BorderColor = Color.FromArgb(93, 110, 234);
            restoreButton.BorderRadius = 8;
            restoreButton.BorderThickness = 1;
            restoreButton.Cursor = Cursors.Hand;
            restoreButton.CustomizableEdges = customizableEdges7;
            restoreButton.DisabledState.BorderColor = Color.FromArgb(28, 28, 36);
            restoreButton.DisabledState.CustomBorderColor = Color.FromArgb(28, 28, 36);
            restoreButton.DisabledState.FillColor = Color.FromArgb(17, 17, 22);
            restoreButton.DisabledState.ForeColor = Color.FromArgb(70, 70, 78);
            restoreButton.FillColor = Color.FromArgb(93, 110, 234);
            restoreButton.Font = new Font("Poppins", 8F);
            restoreButton.ForeColor = Color.FromArgb(247, 243, 244);
            restoreButton.HoverState.BorderColor = Color.FromArgb(120, 134, 242);
            restoreButton.HoverState.FillColor = Color.FromArgb(120, 134, 242);
            restoreButton.HoverState.ForeColor = Color.FromArgb(247, 243, 244);
            restoreButton.Location = new Point(726, 17);
            restoreButton.Name = "restoreButton";
            restoreButton.PressedColor = Color.FromArgb(93, 110, 234);
            restoreButton.ShadowDecoration.CustomizableEdges = customizableEdges8;
            restoreButton.Size = new Size(94, 34);
            restoreButton.TabIndex = 3;
            restoreButton.Text = "Restore";
            restoreButton.TextAlign = HorizontalAlignment.Center;
            restoreButton.Click += OnRestoreClick;
            //
            // subtitleLabel
            //
            subtitleLabel.BackColor = Color.Transparent;
            subtitleLabel.Content = "0 values";
            subtitleLabel.Font = new Font("Poppins", 7.5F);
            subtitleLabel.ForeColor = Color.FromArgb(97, 96, 104);
            subtitleLabel.HorizontalAlignment = StringAlignment.Near;
            subtitleLabel.Location = new Point(62, 34);
            subtitleLabel.Name = "subtitleLabel";
            subtitleLabel.Size = new Size(400, 20);
            subtitleLabel.TabIndex = 2;
            subtitleLabel.VerticalAlignment = StringAlignment.Center;
            //
            // titleLabel
            //
            titleLabel.BackColor = Color.Transparent;
            titleLabel.Content = "Backup";
            titleLabel.Font = new Font("Poppins SemiBold", 9.5F, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(247, 243, 244);
            titleLabel.HorizontalAlignment = StringAlignment.Near;
            titleLabel.Location = new Point(62, 14);
            titleLabel.Name = "titleLabel";
            titleLabel.Size = new Size(400, 20);
            titleLabel.TabIndex = 1;
            titleLabel.VerticalAlignment = StringAlignment.Center;
            //
            // badge
            //
            badge.BorderRadius = 9;
            badge.Controls.Add(icon);
            badge.CustomizableEdges = customizableEdges3;
            badge.FillColor = Color.FromArgb(17, 17, 22);
            badge.Location = new Point(16, 16);
            badge.Name = "badge";
            badge.ShadowDecoration.CustomizableEdges = customizableEdges4;
            badge.Size = new Size(36, 36);
            badge.TabIndex = 0;
            //
            // icon
            //
            icon.BackColor = Color.Transparent;
            icon.Content = Properties.Resources.Backup;
            icon.ImageTint = Color.FromArgb(86, 204, 242);
            icon.Location = new Point(9, 9);
            icon.Name = "icon";
            icon.OutlineThickness = 0F;
            icon.PanelOutlineColor = Color.Transparent;
            icon.Rotation = 0;
            icon.Rounding = new Padding(0);
            icon.Size = new Size(18, 18);
            icon.TabIndex = 0;
            //
            // BackupRow
            //
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(8, 8, 10);
            Controls.Add(surface);
            Margin = new Padding(0, 0, 0, 10);
            Name = "BackupRow";
            Size = new Size(940, 68);
            badge.ResumeLayout(false);
            surface.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private Guna.UI2.WinForms.Guna2Panel surface;
        private Guna.UI2.WinForms.Guna2Panel badge;
        private CuoreUI.Controls.cuiPictureBox icon;
        private CuoreUI.Controls.cuiLabel titleLabel;
        private CuoreUI.Controls.cuiLabel subtitleLabel;
        private Guna.UI2.WinForms.Guna2Button restoreButton;
        private Guna.UI2.WinForms.Guna2Button deleteButton;
    }
}
