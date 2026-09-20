namespace Molnar_Free_Tweaking_Utility.Views
{
    partial class BackupView
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
            titleLabel = new CuoreUI.Controls.cuiLabel();
            subtitleLabel = new CuoreUI.Controls.cuiLabel();
            createButton = new Guna.UI2.WinForms.Guna2Button();
            listHost = new Guna.UI2.WinForms.Guna2Panel();
            listPanel = new FlowLayoutPanel();
            scrollBar = new Guna.UI2.WinForms.Guna2VScrollBar();
            emptyLabel = new CuoreUI.Controls.cuiLabel();
            listHost.SuspendLayout();
            SuspendLayout();
            //
            // titleLabel
            //
            titleLabel.BackColor = Color.Transparent;
            titleLabel.Content = "Backup";
            titleLabel.Font = new Font("Poppins SemiBold", 14F, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(247, 243, 244);
            titleLabel.HorizontalAlignment = StringAlignment.Near;
            titleLabel.Location = new Point(24, 22);
            titleLabel.Name = "titleLabel";
            titleLabel.Size = new Size(500, 30);
            titleLabel.TabIndex = 0;
            titleLabel.VerticalAlignment = StringAlignment.Center;
            //
            // subtitleLabel
            //
            subtitleLabel.BackColor = Color.Transparent;
            subtitleLabel.Content = "Snapshots of every registry value Molnar can change";
            subtitleLabel.Font = new Font("Poppins", 8F);
            subtitleLabel.ForeColor = Color.FromArgb(97, 96, 104);
            subtitleLabel.HorizontalAlignment = StringAlignment.Near;
            subtitleLabel.Location = new Point(24, 52);
            subtitleLabel.Name = "subtitleLabel";
            subtitleLabel.Size = new Size(500, 20);
            subtitleLabel.TabIndex = 1;
            subtitleLabel.VerticalAlignment = StringAlignment.Center;
            //
            // createButton
            //
            createButton.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            createButton.Animated = true;
            createButton.BorderColor = Color.FromArgb(93, 110, 234);
            createButton.BorderRadius = 8;
            createButton.BorderThickness = 1;
            createButton.Cursor = Cursors.Hand;
            createButton.CustomizableEdges = customizableEdges3;
            createButton.DisabledState.BorderColor = Color.FromArgb(28, 28, 36);
            createButton.DisabledState.CustomBorderColor = Color.FromArgb(28, 28, 36);
            createButton.DisabledState.FillColor = Color.FromArgb(17, 17, 22);
            createButton.DisabledState.ForeColor = Color.FromArgb(70, 70, 78);
            createButton.FillColor = Color.FromArgb(93, 110, 234);
            createButton.Font = new Font("Poppins", 8.5F);
            createButton.ForeColor = Color.FromArgb(247, 243, 244);
            createButton.HoverState.BorderColor = Color.FromArgb(120, 134, 242);
            createButton.HoverState.FillColor = Color.FromArgb(120, 134, 242);
            createButton.HoverState.ForeColor = Color.FromArgb(247, 243, 244);
            createButton.Image = Properties.Resources.Backup;
            createButton.ImageAlign = HorizontalAlignment.Left;
            createButton.ImageOffset = new Point(8, 0);
            createButton.ImageSize = new Size(18, 18);
            createButton.Location = new Point(804, 32);
            createButton.Name = "createButton";
            createButton.PressedColor = Color.FromArgb(93, 110, 234);
            createButton.ShadowDecoration.CustomizableEdges = customizableEdges4;
            createButton.Size = new Size(160, 40);
            createButton.TabIndex = 2;
            createButton.Text = "Create Backup";
            createButton.TextAlign = HorizontalAlignment.Center;
            createButton.Click += OnCreateClick;
            //
            // listHost
            //
            listHost.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            listHost.BorderRadius = 0;
            listHost.Controls.Add(listPanel);
            listHost.CustomizableEdges = customizableEdges1;
            listHost.FillColor = Color.FromArgb(8, 8, 10);
            listHost.Location = new Point(24, 90);
            listHost.Name = "listHost";
            listHost.ShadowDecoration.CustomizableEdges = customizableEdges2;
            listHost.Size = new Size(940, 504);
            listHost.TabIndex = 3;
            //
            // listPanel
            //
            listPanel.AutoScroll = true;
            listPanel.BackColor = Color.FromArgb(8, 8, 10);
            listPanel.FlowDirection = FlowDirection.TopDown;
            listPanel.Location = new Point(0, 0);
            listPanel.Name = "listPanel";
            listPanel.Size = new Size(957, 504);
            listPanel.TabIndex = 0;
            listPanel.WrapContents = false;
            //
            // scrollBar
            //
            scrollBar.AutoRoundedCorners = true;
            scrollBar.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Right;
            scrollBar.BindingContainer = listPanel;
            scrollBar.InUpdate = false;
            scrollBar.LargeChange = 10;
            scrollBar.Location = new Point(972, 90);
            scrollBar.Maximum = 100;
            scrollBar.Name = "scrollBar";
            scrollBar.ScrollbarSize = 8;
            scrollBar.Size = new Size(8, 504);
            scrollBar.TabIndex = 4;
            scrollBar.BorderColor = Color.FromArgb(8, 8, 10);
            scrollBar.FillColor = Color.FromArgb(8, 8, 10);
            scrollBar.HoverState.BorderColor = Color.FromArgb(8, 8, 10);
            scrollBar.HoverState.FillColor = Color.FromArgb(8, 8, 10);
            scrollBar.HoverState.ThumbColor = Color.FromArgb(70, 74, 100);
            scrollBar.PressedState.BorderColor = Color.FromArgb(8, 8, 10);
            scrollBar.PressedState.FillColor = Color.FromArgb(8, 8, 10);
            scrollBar.PressedState.ThumbColor = Color.FromArgb(93, 110, 234);
            scrollBar.ThumbColor = Color.FromArgb(46, 48, 64);
            scrollBar.ThumbStyle = Guna.UI2.WinForms.Enums.ThumbStyle.Inset;
            //
            // emptyLabel
            //
            emptyLabel.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            emptyLabel.BackColor = Color.Transparent;
            emptyLabel.Content = "No backups yet. Create one before applying optimizations.";
            emptyLabel.Font = new Font("Poppins", 9F);
            emptyLabel.ForeColor = Color.FromArgb(97, 96, 104);
            emptyLabel.HorizontalAlignment = StringAlignment.Center;
            emptyLabel.Location = new Point(24, 300);
            emptyLabel.Name = "emptyLabel";
            emptyLabel.Size = new Size(940, 30);
            emptyLabel.TabIndex = 5;
            emptyLabel.VerticalAlignment = StringAlignment.Center;
            //
            // BackupView
            //
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(8, 8, 10);
            Controls.Add(emptyLabel);
            Controls.Add(scrollBar);
            Controls.Add(listHost);
            Controls.Add(createButton);
            Controls.Add(subtitleLabel);
            Controls.Add(titleLabel);
            Name = "BackupView";
            Size = new Size(1000, 610);
            listHost.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private CuoreUI.Controls.cuiLabel titleLabel;
        private CuoreUI.Controls.cuiLabel subtitleLabel;
        private Guna.UI2.WinForms.Guna2Button createButton;
        private Guna.UI2.WinForms.Guna2Panel listHost;
        private FlowLayoutPanel listPanel;
        private Guna.UI2.WinForms.Guna2VScrollBar scrollBar;
        private CuoreUI.Controls.cuiLabel emptyLabel;
    }
}
