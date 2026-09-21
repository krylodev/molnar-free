namespace Molnar_Free_Tweaking_Utility
{
    partial class Main
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

        #region Windows Form Designer generated code

        private void InitializeComponent()
        {
            components = new System.ComponentModel.Container();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges19 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges20 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges5 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges6 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges7 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges8 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges9 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges10 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges11 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges12 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges13 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges14 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges15 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges16 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges17 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges18 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            formRounder = new CuoreUI.Components.cuiFormRounder();
            formDrag = new CuoreUI.Components.cuiFormDrag(components);
            pageAnimator = new CuoreUI.Components.cuiControlAnimator();
            indicatorAnimator = new CuoreUI.Components.cuiControlAnimator();
            navIndicator = new Guna.UI2.WinForms.Guna2Panel();
            navTooltip = new Guna.UI2.WinForms.Guna2HtmlToolTip();
            topBar = new Guna.UI2.WinForms.Guna2Panel();
            navAbout = new Guna.UI2.WinForms.Guna2Button();
            navSettings = new Guna.UI2.WinForms.Guna2Button();
            navBackup = new Guna.UI2.WinForms.Guna2Button();
            navOptimizations = new Guna.UI2.WinForms.Guna2Button();
            navDashboard = new Guna.UI2.WinForms.Guna2Button();
            brandLabel = new CuoreUI.Controls.cuiLabel();
            logoBox = new CuoreUI.Controls.cuiPictureBox();
            closeBox = new Guna.UI2.WinForms.Guna2ControlBox();
            minimizeBox = new Guna.UI2.WinForms.Guna2ControlBox();
            titleLabel = new CuoreUI.Controls.cuiLabel();
            cuiLabel1 = new CuoreUI.Controls.cuiLabel();
            pageHost = new Guna.UI2.WinForms.Guna2Panel();
            form_anim = new CuoreUI.Components.cuiFormAnimator(components);
            topbardrag = new CuoreUI.Components.cuiControlDrag(components);
            toplabeldrag = new CuoreUI.Components.cuiControlDrag(components);
            topBar.SuspendLayout();
            SuspendLayout();
            // 
            // formRounder
            // 
            formRounder.OutlineColor = Color.FromArgb(28, 28, 36);
            formRounder.Rounding = 12;
            formRounder.TargetForm = this;
            // 
            // formDrag
            // 
            formDrag.TargetForm = this;
            // 
            // pageAnimator
            // 
            pageAnimator.AnimateLocation = true;
            pageAnimator.AnimateOnStart = false;
            pageAnimator.AnimateOpacity = false;
            pageAnimator.Duration = 400;
            pageAnimator.EasingType = CuoreUI.Helpers.DrawingHelper.EasingTypes.QuartOut;
            pageAnimator.TargetControl = null;
            pageAnimator.TargetLocation = new Point(0, 0);
            pageAnimator.TargetOpacity = CuoreUI.Components.cuiControlAnimator.OpacityEnum.Visible;
            // 
            // indicatorAnimator
            // 
            indicatorAnimator.AnimateLocation = true;
            indicatorAnimator.AnimateOnStart = false;
            indicatorAnimator.AnimateOpacity = false;
            indicatorAnimator.Duration = 260;
            indicatorAnimator.EasingType = CuoreUI.Helpers.DrawingHelper.EasingTypes.QuartOut;
            indicatorAnimator.TargetControl = navIndicator;
            indicatorAnimator.TargetLocation = new Point(738, 82);
            indicatorAnimator.TargetOpacity = CuoreUI.Components.cuiControlAnimator.OpacityEnum.Visible;
            // 
            // navIndicator
            // 
            navIndicator.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            navIndicator.BorderRadius = 1;
            navIndicator.CustomizableEdges = customizableEdges3;
            navIndicator.FillColor = Color.FromArgb(93, 110, 234);
            navIndicator.Location = new Point(738, 82);
            navIndicator.Name = "navIndicator";
            navIndicator.ShadowDecoration.CustomizableEdges = customizableEdges4;
            navIndicator.Size = new Size(24, 3);
            navIndicator.TabIndex = 11;
            // 
            // navTooltip
            // 
            navTooltip.AllowLinksHandling = true;
            navTooltip.BackColor = Color.FromArgb(22, 22, 28);
            navTooltip.BorderColor = Color.FromArgb(38, 38, 50);
            navTooltip.Font = new Font("Poppins", 8F);
            navTooltip.ForeColor = Color.FromArgb(247, 243, 244);
            navTooltip.MaximumSize = new Size(0, 0);
            navTooltip.TitleFont = new Font("Poppins SemiBold", 8F, FontStyle.Bold);
            // 
            // topBar
            // 
            topBar.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            topBar.Controls.Add(navIndicator);
            topBar.Controls.Add(navAbout);
            topBar.Controls.Add(navSettings);
            topBar.Controls.Add(navBackup);
            topBar.Controls.Add(navOptimizations);
            topBar.Controls.Add(navDashboard);
            topBar.Controls.Add(brandLabel);
            topBar.Controls.Add(logoBox);
            topBar.Controls.Add(closeBox);
            topBar.Controls.Add(minimizeBox);
            topBar.Controls.Add(titleLabel);
            topBar.Controls.Add(cuiLabel1);
            topBar.CustomizableEdges = customizableEdges19;
            topBar.FillColor = Color.FromArgb(13, 13, 16);
            topBar.Location = new Point(0, 0);
            topBar.Name = "topBar";
            topBar.ShadowDecoration.CustomizableEdges = customizableEdges20;
            topBar.Size = new Size(1000, 90);
            topBar.TabIndex = 0;
            // 
            // navAbout
            // 
            navAbout.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            navAbout.Animated = true;
            navAbout.BackColor = Color.FromArgb(13, 13, 16);
            navAbout.BorderRadius = 10;
            navAbout.ButtonMode = Guna.UI2.WinForms.Enums.ButtonMode.ToogleButton;
            navAbout.CheckedState.FillColor = Color.FromArgb(22, 22, 28);
            navAbout.Cursor = Cursors.Hand;
            navAbout.CustomizableEdges = customizableEdges5;
            navAbout.DisabledState.FillColor = Color.Transparent;
            navAbout.FillColor = Color.Transparent;
            navAbout.Font = new Font("Poppins", 8.25F);
            navAbout.ForeColor = Color.White;
            navAbout.HoverState.FillColor = Color.FromArgb(22, 22, 28);
            navAbout.ImageSize = new Size(22, 22);
            navAbout.Location = new Point(936, 36);
            navAbout.Name = "navAbout";
            navAbout.PressedColor = Color.FromArgb(28, 28, 36);
            navAbout.ShadowDecoration.CustomizableEdges = customizableEdges6;
            navAbout.Size = new Size(44, 44);
            navAbout.TabIndex = 9;
            navAbout.Click += OnNavigate;
            // 
            // navSettings
            // 
            navSettings.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            navSettings.Animated = true;
            navSettings.BackColor = Color.FromArgb(13, 13, 16);
            navSettings.BorderRadius = 10;
            navSettings.ButtonMode = Guna.UI2.WinForms.Enums.ButtonMode.ToogleButton;
            navSettings.CheckedState.FillColor = Color.FromArgb(22, 22, 28);
            navSettings.Cursor = Cursors.Hand;
            navSettings.CustomizableEdges = customizableEdges7;
            navSettings.DisabledState.FillColor = Color.Transparent;
            navSettings.FillColor = Color.Transparent;
            navSettings.Font = new Font("Poppins", 8.25F);
            navSettings.ForeColor = Color.White;
            navSettings.HoverState.FillColor = Color.FromArgb(22, 22, 28);
            navSettings.ImageSize = new Size(22, 22);
            navSettings.Location = new Point(884, 36);
            navSettings.Name = "navSettings";
            navSettings.PressedColor = Color.FromArgb(28, 28, 36);
            navSettings.ShadowDecoration.CustomizableEdges = customizableEdges8;
            navSettings.Size = new Size(44, 44);
            navSettings.TabIndex = 8;
            navSettings.Click += OnNavigate;
            // 
            // navBackup
            // 
            navBackup.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            navBackup.Animated = true;
            navBackup.BackColor = Color.FromArgb(13, 13, 16);
            navBackup.BorderRadius = 10;
            navBackup.ButtonMode = Guna.UI2.WinForms.Enums.ButtonMode.ToogleButton;
            navBackup.CheckedState.FillColor = Color.FromArgb(22, 22, 28);
            navBackup.Cursor = Cursors.Hand;
            navBackup.CustomizableEdges = customizableEdges9;
            navBackup.DisabledState.FillColor = Color.Transparent;
            navBackup.FillColor = Color.Transparent;
            navBackup.Font = new Font("Poppins", 8.25F);
            navBackup.ForeColor = Color.White;
            navBackup.HoverState.FillColor = Color.FromArgb(22, 22, 28);
            navBackup.ImageSize = new Size(22, 22);
            navBackup.Location = new Point(832, 36);
            navBackup.Name = "navBackup";
            navBackup.PressedColor = Color.FromArgb(28, 28, 36);
            navBackup.ShadowDecoration.CustomizableEdges = customizableEdges10;
            navBackup.Size = new Size(44, 44);
            navBackup.TabIndex = 7;
            navBackup.Click += OnNavigate;
            // 
            // navOptimizations
            // 
            navOptimizations.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            navOptimizations.Animated = true;
            navOptimizations.BackColor = Color.FromArgb(13, 13, 16);
            navOptimizations.BorderRadius = 10;
            navOptimizations.ButtonMode = Guna.UI2.WinForms.Enums.ButtonMode.ToogleButton;
            navOptimizations.CheckedState.FillColor = Color.FromArgb(22, 22, 28);
            navOptimizations.Cursor = Cursors.Hand;
            navOptimizations.CustomizableEdges = customizableEdges11;
            navOptimizations.DisabledState.FillColor = Color.Transparent;
            navOptimizations.FillColor = Color.Transparent;
            navOptimizations.Font = new Font("Poppins", 8.25F);
            navOptimizations.ForeColor = Color.White;
            navOptimizations.HoverState.FillColor = Color.FromArgb(22, 22, 28);
            navOptimizations.ImageSize = new Size(22, 22);
            navOptimizations.Location = new Point(780, 36);
            navOptimizations.Name = "navOptimizations";
            navOptimizations.PressedColor = Color.FromArgb(28, 28, 36);
            navOptimizations.ShadowDecoration.CustomizableEdges = customizableEdges12;
            navOptimizations.Size = new Size(44, 44);
            navOptimizations.TabIndex = 6;
            navOptimizations.Click += OnNavigate;
            // 
            // navDashboard
            // 
            navDashboard.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            navDashboard.Animated = true;
            navDashboard.BackColor = Color.FromArgb(13, 13, 16);
            navDashboard.BorderRadius = 10;
            navDashboard.ButtonMode = Guna.UI2.WinForms.Enums.ButtonMode.ToogleButton;
            navDashboard.CheckedState.FillColor = Color.FromArgb(22, 22, 28);
            navDashboard.Cursor = Cursors.Hand;
            navDashboard.CustomizableEdges = customizableEdges13;
            navDashboard.DisabledState.FillColor = Color.Transparent;
            navDashboard.FillColor = Color.Transparent;
            navDashboard.Font = new Font("Poppins", 8.25F);
            navDashboard.ForeColor = Color.White;
            navDashboard.HoverState.FillColor = Color.FromArgb(22, 22, 28);
            navDashboard.ImageSize = new Size(22, 22);
            navDashboard.Location = new Point(728, 36);
            navDashboard.Name = "navDashboard";
            navDashboard.PressedColor = Color.FromArgb(28, 28, 36);
            navDashboard.ShadowDecoration.CustomizableEdges = customizableEdges14;
            navDashboard.Size = new Size(44, 44);
            navDashboard.TabIndex = 5;
            navDashboard.Click += OnNavigate;
            // 
            // brandLabel
            // 
            brandLabel.BackColor = Color.Transparent;
            brandLabel.Content = "Molnar";
            brandLabel.Font = new Font("Poppins SemiBold", 13F, FontStyle.Bold);
            brandLabel.ForeColor = Color.FromArgb(247, 243, 244);
            brandLabel.HorizontalAlignment = StringAlignment.Near;
            brandLabel.Location = new Point(60, 44);
            brandLabel.Margin = new Padding(4, 3, 4, 3);
            brandLabel.Name = "brandLabel";
            brandLabel.Size = new Size(70, 28);
            brandLabel.TabIndex = 3;
            brandLabel.VerticalAlignment = StringAlignment.Center;
            // 
            // logoBox
            // 
            logoBox.BackColor = Color.Transparent;
            logoBox.Content = Properties.Resources.Logo;
            logoBox.ImageTint = Color.White;
            logoBox.Location = new Point(20, 40);
            logoBox.Margin = new Padding(4, 3, 4, 3);
            logoBox.Name = "logoBox";
            logoBox.OutlineThickness = 0F;
            logoBox.PanelOutlineColor = Color.Transparent;
            logoBox.Rotation = 0;
            logoBox.Rounding = new Padding(0);
            logoBox.Size = new Size(32, 32);
            logoBox.TabIndex = 2;
            // 
            // closeBox
            // 
            closeBox.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            closeBox.Animated = true;
            closeBox.BackColor = Color.FromArgb(13, 13, 16);
            closeBox.Cursor = Cursors.Hand;
            closeBox.CustomizableEdges = customizableEdges15;
            closeBox.FillColor = Color.FromArgb(13, 13, 16);
            closeBox.HoverState.BorderColor = Color.FromArgb(13, 13, 16);
            closeBox.HoverState.FillColor = Color.FromArgb(13, 13, 16);
            closeBox.HoverState.IconColor = Color.FromArgb(253, 6, 87);
            closeBox.IconColor = Color.FromArgb(97, 96, 104);
            closeBox.Location = new Point(966, 2);
            closeBox.Name = "closeBox";
            closeBox.PressedColor = Color.FromArgb(13, 13, 16);
            closeBox.ShadowDecoration.CustomizableEdges = customizableEdges16;
            closeBox.Size = new Size(30, 26);
            closeBox.TabIndex = 1;
            // 
            // minimizeBox
            // 
            minimizeBox.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            minimizeBox.Animated = true;
            minimizeBox.BackColor = Color.FromArgb(13, 13, 16);
            minimizeBox.ControlBoxType = Guna.UI2.WinForms.Enums.ControlBoxType.MinimizeBox;
            minimizeBox.Cursor = Cursors.Hand;
            minimizeBox.CustomizableEdges = customizableEdges17;
            minimizeBox.FillColor = Color.FromArgb(13, 13, 16);
            minimizeBox.HoverState.BorderColor = Color.FromArgb(13, 13, 16);
            minimizeBox.HoverState.FillColor = Color.FromArgb(13, 13, 16);
            minimizeBox.HoverState.IconColor = Color.FromArgb(247, 243, 244);
            minimizeBox.IconColor = Color.FromArgb(97, 96, 104);
            minimizeBox.Location = new Point(934, 2);
            minimizeBox.Name = "minimizeBox";
            minimizeBox.PressedColor = Color.FromArgb(13, 13, 16);
            minimizeBox.ShadowDecoration.CustomizableEdges = customizableEdges18;
            minimizeBox.Size = new Size(30, 26);
            minimizeBox.TabIndex = 0;
            // 
            // titleLabel
            // 
            titleLabel.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            titleLabel.BackColor = Color.Transparent;
            titleLabel.Content = "BETA\\ v1\\.0\\.1";
            titleLabel.Font = new Font("Poppins SemiBold", 8F, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(97, 96, 104);
            titleLabel.HorizontalAlignment = StringAlignment.Center;
            titleLabel.Location = new Point(0, 0);
            titleLabel.Margin = new Padding(4, 3, 4, 3);
            titleLabel.Name = "titleLabel";
            titleLabel.Size = new Size(1000, 30);
            titleLabel.TabIndex = 0;
            titleLabel.VerticalAlignment = StringAlignment.Center;
            // 
            // cuiLabel1
            // 
            cuiLabel1.BackColor = Color.Transparent;
            cuiLabel1.Content = "Free";
            cuiLabel1.Font = new Font("Poppins SemiBold", 13F, FontStyle.Bold);
            cuiLabel1.ForeColor = Color.FromArgb(93, 110, 234);
            cuiLabel1.HorizontalAlignment = StringAlignment.Near;
            cuiLabel1.Location = new Point(127, 44);
            cuiLabel1.Margin = new Padding(4, 3, 4, 3);
            cuiLabel1.Name = "cuiLabel1";
            cuiLabel1.Size = new Size(90, 28);
            cuiLabel1.TabIndex = 12;
            cuiLabel1.VerticalAlignment = StringAlignment.Center;
            // 
            // pageHost
            // 
            pageHost.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            pageHost.CustomizableEdges = customizableEdges1;
            pageHost.FillColor = Color.FromArgb(8, 8, 10);
            pageHost.Location = new Point(0, 90);
            pageHost.Name = "pageHost";
            pageHost.ShadowDecoration.CustomizableEdges = customizableEdges2;
            pageHost.Size = new Size(1000, 608);
            pageHost.TabIndex = 1;
            // 
            // form_anim
            // 
            form_anim.AnimateOnStart = true;
            form_anim.Duration = 1000;
            form_anim.EasingType = CuoreUI.Helpers.DrawingHelper.EasingTypes.QuadOut;
            form_anim.StartOpacity = 0D;
            form_anim.TargetForm = this;
            form_anim.TargetOpacity = 1D;
            // 
            // topbardrag
            // 
            topbardrag.TargetControl = topBar;
            // 
            // toplabeldrag
            // 
            toplabeldrag.TargetControl = titleLabel;
            // 
            // Main
            // 
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(8, 8, 10);
            ClientSize = new Size(1000, 700);
            Controls.Add(pageHost);
            Controls.Add(topBar);
            DoubleBuffered = true;
            Font = new Font("Poppins", 8.25F);
            ForeColor = Color.FromArgb(247, 243, 244);
            FormBorderStyle = FormBorderStyle.None;
            MaximizeBox = false;
            MaximumSize = new Size(1000, 700);
            MinimumSize = new Size(1000, 700);
            Name = "Main";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Molnar Free Tweaking Utility";
            topBar.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private CuoreUI.Components.cuiFormRounder formRounder;
        private CuoreUI.Components.cuiFormDrag formDrag;
        private CuoreUI.Components.cuiControlAnimator pageAnimator;
        private CuoreUI.Components.cuiControlAnimator indicatorAnimator;
        private Guna.UI2.WinForms.Guna2HtmlToolTip navTooltip;
        private Guna.UI2.WinForms.Guna2Panel topBar;
        private CuoreUI.Controls.cuiLabel titleLabel;
        private Guna.UI2.WinForms.Guna2ControlBox minimizeBox;
        private Guna.UI2.WinForms.Guna2ControlBox closeBox;
        private CuoreUI.Controls.cuiPictureBox logoBox;
        private CuoreUI.Controls.cuiLabel brandLabel;
        private Guna.UI2.WinForms.Guna2Button navDashboard;
        private Guna.UI2.WinForms.Guna2Button navOptimizations;
        private Guna.UI2.WinForms.Guna2Button navBackup;
        private Guna.UI2.WinForms.Guna2Button navSettings;
        private Guna.UI2.WinForms.Guna2Button navAbout;
        private Guna.UI2.WinForms.Guna2Panel navIndicator;
        private Guna.UI2.WinForms.Guna2Panel pageHost;
        private CuoreUI.Controls.cuiLabel cuiLabel1;
        private CuoreUI.Components.cuiFormAnimator form_anim;
        private CuoreUI.Components.cuiControlDrag topbardrag;
        private CuoreUI.Components.cuiControlDrag toplabeldrag;
    }
}
