namespace Molnar_Free_Tweaking_Utility.Views
{
    partial class AboutView
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
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges5 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges6 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges7 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges8 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            heroPanel = new Guna.UI2.WinForms.Guna2Panel();
            websiteButton = new Guna.UI2.WinForms.Guna2Button();
            discordButton = new Guna.UI2.WinForms.Guna2Button();
            versionLabel = new CuoreUI.Controls.cuiLabel();
            nameLabel = new CuoreUI.Controls.cuiLabel();
            systemPanel = new Guna.UI2.WinForms.Guna2Panel();
            systemLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            systemTitle = new CuoreUI.Controls.cuiLabel();
            disclaimerLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            pictureBox1 = new PictureBox();
            heroPanel.SuspendLayout();
            systemPanel.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)pictureBox1).BeginInit();
            SuspendLayout();
            // 
            // heroPanel
            // 
            heroPanel.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            heroPanel.BorderColor = Color.FromArgb(28, 28, 36);
            heroPanel.BorderRadius = 12;
            heroPanel.BorderThickness = 1;
            heroPanel.Controls.Add(pictureBox1);
            heroPanel.Controls.Add(websiteButton);
            heroPanel.Controls.Add(discordButton);
            heroPanel.Controls.Add(versionLabel);
            heroPanel.Controls.Add(nameLabel);
            heroPanel.CustomizableEdges = customizableEdges5;
            heroPanel.FillColor = Color.FromArgb(13, 13, 16);
            heroPanel.Location = new Point(24, 24);
            heroPanel.Name = "heroPanel";
            heroPanel.ShadowDecoration.CustomizableEdges = customizableEdges6;
            heroPanel.Size = new Size(952, 150);
            heroPanel.TabIndex = 0;
            // 
            // websiteButton
            // 
            websiteButton.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            websiteButton.Animated = true;
            websiteButton.BorderColor = Color.FromArgb(93, 110, 234);
            websiteButton.BorderRadius = 8;
            websiteButton.BorderThickness = 1;
            websiteButton.Cursor = Cursors.Hand;
            websiteButton.CustomizableEdges = customizableEdges1;
            websiteButton.DisabledState.BorderColor = Color.FromArgb(28, 28, 36);
            websiteButton.DisabledState.CustomBorderColor = Color.FromArgb(28, 28, 36);
            websiteButton.DisabledState.FillColor = Color.FromArgb(17, 17, 22);
            websiteButton.DisabledState.ForeColor = Color.FromArgb(70, 70, 78);
            websiteButton.FillColor = Color.FromArgb(93, 110, 234);
            websiteButton.Font = new Font("Poppins", 8.5F);
            websiteButton.ForeColor = Color.FromArgb(247, 243, 244);
            websiteButton.HoverState.BorderColor = Color.FromArgb(120, 134, 242);
            websiteButton.HoverState.FillColor = Color.FromArgb(120, 134, 242);
            websiteButton.HoverState.ForeColor = Color.FromArgb(247, 243, 244);
            websiteButton.Location = new Point(796, 57);
            websiteButton.Name = "websiteButton";
            websiteButton.PressedColor = Color.FromArgb(93, 110, 234);
            websiteButton.ShadowDecoration.CustomizableEdges = customizableEdges2;
            websiteButton.Size = new Size(126, 36);
            websiteButton.TabIndex = 4;
            websiteButton.Text = "Get Premium";
            websiteButton.Click += OnPremiumClick;
            // 
            // discordButton
            // 
            discordButton.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            discordButton.Animated = true;
            discordButton.BorderColor = Color.FromArgb(38, 38, 50);
            discordButton.BorderRadius = 8;
            discordButton.BorderThickness = 1;
            discordButton.Cursor = Cursors.Hand;
            discordButton.CustomizableEdges = customizableEdges3;
            discordButton.DisabledState.BorderColor = Color.FromArgb(28, 28, 36);
            discordButton.DisabledState.CustomBorderColor = Color.FromArgb(28, 28, 36);
            discordButton.DisabledState.FillColor = Color.FromArgb(17, 17, 22);
            discordButton.DisabledState.ForeColor = Color.FromArgb(70, 70, 78);
            discordButton.FillColor = Color.FromArgb(22, 22, 28);
            discordButton.Font = new Font("Poppins", 8.5F);
            discordButton.ForeColor = Color.FromArgb(247, 243, 244);
            discordButton.HoverState.BorderColor = Color.FromArgb(46, 48, 64);
            discordButton.HoverState.FillColor = Color.FromArgb(32, 32, 42);
            discordButton.HoverState.ForeColor = Color.FromArgb(247, 243, 244);
            discordButton.Location = new Point(660, 57);
            discordButton.Name = "discordButton";
            discordButton.PressedColor = Color.FromArgb(32, 32, 42);
            discordButton.ShadowDecoration.CustomizableEdges = customizableEdges4;
            discordButton.Size = new Size(126, 36);
            discordButton.TabIndex = 3;
            discordButton.Text = "Discord";
            discordButton.Click += OnDiscordClick;
            // 
            // versionLabel
            // 
            versionLabel.BackColor = Color.Transparent;
            versionLabel.Content = "Version\\ 1\\.0\\.0";
            versionLabel.Font = new Font("Poppins", 8.5F);
            versionLabel.ForeColor = Color.FromArgb(97, 96, 104);
            versionLabel.HorizontalAlignment = StringAlignment.Near;
            versionLabel.Location = new Point(132, 78);
            versionLabel.Margin = new Padding(4, 3, 4, 3);
            versionLabel.Name = "versionLabel";
            versionLabel.Size = new Size(500, 22);
            versionLabel.TabIndex = 2;
            versionLabel.VerticalAlignment = StringAlignment.Center;
            // 
            // nameLabel
            // 
            nameLabel.BackColor = Color.Transparent;
            nameLabel.Content = "Molnar\\ Free\\ Tweaking\\ Utility";
            nameLabel.Font = new Font("Poppins SemiBold", 16F, FontStyle.Bold);
            nameLabel.ForeColor = Color.FromArgb(247, 243, 244);
            nameLabel.HorizontalAlignment = StringAlignment.Near;
            nameLabel.Location = new Point(132, 44);
            nameLabel.Margin = new Padding(4, 3, 4, 3);
            nameLabel.Name = "nameLabel";
            nameLabel.Size = new Size(500, 34);
            nameLabel.TabIndex = 1;
            nameLabel.VerticalAlignment = StringAlignment.Center;
            // 
            // systemPanel
            // 
            systemPanel.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            systemPanel.BorderColor = Color.FromArgb(28, 28, 36);
            systemPanel.BorderRadius = 12;
            systemPanel.BorderThickness = 1;
            systemPanel.Controls.Add(systemLabel);
            systemPanel.Controls.Add(systemTitle);
            systemPanel.CustomizableEdges = customizableEdges7;
            systemPanel.FillColor = Color.FromArgb(13, 13, 16);
            systemPanel.Location = new Point(24, 192);
            systemPanel.Name = "systemPanel";
            systemPanel.ShadowDecoration.CustomizableEdges = customizableEdges8;
            systemPanel.Size = new Size(952, 200);
            systemPanel.TabIndex = 1;
            // 
            // systemLabel
            // 
            systemLabel.AutoSize = false;
            systemLabel.BackColor = Color.Transparent;
            systemLabel.Font = new Font("Poppins", 8.5F);
            systemLabel.ForeColor = Color.FromArgb(150, 150, 160);
            systemLabel.IsContextMenuEnabled = false;
            systemLabel.IsSelectionEnabled = false;
            systemLabel.Location = new Point(24, 48);
            systemLabel.Name = "systemLabel";
            systemLabel.Size = new Size(900, 136);
            systemLabel.TabIndex = 1;
            systemLabel.Text = null;
            // 
            // systemTitle
            // 
            systemTitle.BackColor = Color.Transparent;
            systemTitle.Content = "SYSTEM";
            systemTitle.Font = new Font("Poppins SemiBold", 8F, FontStyle.Bold);
            systemTitle.ForeColor = Color.FromArgb(97, 96, 104);
            systemTitle.HorizontalAlignment = StringAlignment.Near;
            systemTitle.Location = new Point(24, 18);
            systemTitle.Margin = new Padding(4, 3, 4, 3);
            systemTitle.Name = "systemTitle";
            systemTitle.Size = new Size(400, 22);
            systemTitle.TabIndex = 0;
            systemTitle.VerticalAlignment = StringAlignment.Center;
            // 
            // disclaimerLabel
            // 
            disclaimerLabel.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            disclaimerLabel.AutoSize = false;
            disclaimerLabel.BackColor = Color.Transparent;
            disclaimerLabel.Font = new Font("Poppins", 8F);
            disclaimerLabel.ForeColor = Color.FromArgb(97, 96, 104);
            disclaimerLabel.IsContextMenuEnabled = false;
            disclaimerLabel.IsSelectionEnabled = false;
            disclaimerLabel.Location = new Point(24, 408);
            disclaimerLabel.Name = "disclaimerLabel";
            disclaimerLabel.Size = new Size(952, 60);
            disclaimerLabel.TabIndex = 2;
            disclaimerLabel.Text = "Made from gamers for gamers by @krylo.dev & @dicc";
            // 
            // pictureBox1
            // 
            pictureBox1.BackColor = Color.FromArgb(13, 13, 16);
            pictureBox1.Image = Properties.Resources.Logo;
            pictureBox1.Location = new Point(28, 32);
            pictureBox1.Name = "pictureBox1";
            pictureBox1.Size = new Size(86, 86);
            pictureBox1.SizeMode = PictureBoxSizeMode.StretchImage;
            pictureBox1.TabIndex = 5;
            pictureBox1.TabStop = false;
            // 
            // AboutView
            // 
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(8, 8, 10);
            Controls.Add(disclaimerLabel);
            Controls.Add(systemPanel);
            Controls.Add(heroPanel);
            Name = "AboutView";
            Size = new Size(1000, 610);
            Load += AboutView_Load;
            heroPanel.ResumeLayout(false);
            systemPanel.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)pictureBox1).EndInit();
            ResumeLayout(false);
        }

        #endregion

        private Guna.UI2.WinForms.Guna2Panel heroPanel;
        private CuoreUI.Controls.cuiLabel nameLabel;
        private CuoreUI.Controls.cuiLabel versionLabel;
        private Guna.UI2.WinForms.Guna2Button discordButton;
        private Guna.UI2.WinForms.Guna2Button websiteButton;
        private Guna.UI2.WinForms.Guna2Panel systemPanel;
        private CuoreUI.Controls.cuiLabel systemTitle;
        private Guna.UI2.WinForms.Guna2HtmlLabel systemLabel;
        private Guna.UI2.WinForms.Guna2HtmlLabel disclaimerLabel;
        private PictureBox pictureBox1;
    }
}
