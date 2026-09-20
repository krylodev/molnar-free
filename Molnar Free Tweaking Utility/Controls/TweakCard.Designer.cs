namespace Molnar_Free_Tweaking_Utility.Controls
{
    partial class TweakCard
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
            surface = new Guna.UI2.WinForms.Guna2Panel();
            readMoreLabel = new CuoreUI.Controls.cuiLabel();
            descriptionLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            titleLabel = new CuoreUI.Controls.cuiLabel();
            toggle = new Guna.UI2.WinForms.Guna2ToggleSwitch();
            chips = new FlowLayoutPanel();
            surface.SuspendLayout();
            SuspendLayout();
            //
            // surface
            //
            surface.BorderColor = Color.FromArgb(28, 28, 36);
            surface.BorderRadius = 10;
            surface.BorderThickness = 1;
            surface.Controls.Add(readMoreLabel);
            surface.Controls.Add(descriptionLabel);
            surface.Controls.Add(titleLabel);
            surface.Controls.Add(toggle);
            surface.Controls.Add(chips);
            surface.CustomizableEdges = customizableEdges1;
            surface.Dock = DockStyle.Fill;
            surface.FillColor = Color.FromArgb(13, 13, 16);
            surface.Location = new Point(0, 0);
            surface.Name = "surface";
            surface.ShadowDecoration.CustomizableEdges = customizableEdges2;
            surface.Size = new Size(292, 150);
            surface.TabIndex = 0;
            //
            // readMoreLabel
            //
            readMoreLabel.BackColor = Color.Transparent;
            readMoreLabel.Content = "READ MORE";
            readMoreLabel.Cursor = Cursors.Hand;
            readMoreLabel.Font = new Font("Poppins", 7.5F, FontStyle.Underline);
            readMoreLabel.ForeColor = Color.FromArgb(247, 243, 244);
            readMoreLabel.HorizontalAlignment = StringAlignment.Near;
            readMoreLabel.Location = new Point(14, 120);
            readMoreLabel.Name = "readMoreLabel";
            readMoreLabel.Size = new Size(90, 18);
            readMoreLabel.TabIndex = 4;
            readMoreLabel.VerticalAlignment = StringAlignment.Center;
            readMoreLabel.Click += OnReadMoreClick;
            //
            // descriptionLabel
            //
            descriptionLabel.AutoSize = false;
            descriptionLabel.BackColor = Color.Transparent;
            descriptionLabel.Font = new Font("Poppins", 8F);
            descriptionLabel.ForeColor = Color.FromArgb(97, 96, 104);
            descriptionLabel.IsContextMenuEnabled = false;
            descriptionLabel.IsSelectionEnabled = false;
            descriptionLabel.Location = new Point(14, 78);
            descriptionLabel.Name = "descriptionLabel";
            descriptionLabel.Size = new Size(264, 40);
            descriptionLabel.TabIndex = 3;
            descriptionLabel.Text = "Description";
            //
            // titleLabel
            //
            titleLabel.BackColor = Color.Transparent;
            titleLabel.Content = "Tweak name";
            titleLabel.Font = new Font("Poppins SemiBold", 10F, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(247, 243, 244);
            titleLabel.HorizontalAlignment = StringAlignment.Near;
            titleLabel.Location = new Point(14, 52);
            titleLabel.Name = "titleLabel";
            titleLabel.Size = new Size(264, 24);
            titleLabel.TabIndex = 2;
            titleLabel.VerticalAlignment = StringAlignment.Center;
            //
            // toggle
            //
            toggle.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            toggle.Animated = true;
            toggle.BackColor = Color.Transparent;
            toggle.CheckedState.BorderColor = Color.FromArgb(93, 110, 234);
            toggle.CheckedState.BorderThickness = 0;
            toggle.CheckedState.FillColor = Color.FromArgb(93, 110, 234);
            toggle.CheckedState.InnerBorderColor = Color.White;
            toggle.CheckedState.InnerColor = Color.White;
            toggle.Cursor = Cursors.Hand;
            toggle.CustomizableEdges = customizableEdges3;
            toggle.Location = new Point(232, 17);
            toggle.Name = "toggle";
            toggle.ShadowDecoration.CustomizableEdges = customizableEdges4;
            toggle.Size = new Size(46, 22);
            toggle.TabIndex = 1;
            toggle.UncheckedState.BorderColor = Color.FromArgb(40, 42, 62);
            toggle.UncheckedState.BorderThickness = 0;
            toggle.UncheckedState.FillColor = Color.FromArgb(40, 42, 62);
            toggle.UncheckedState.InnerBorderColor = Color.FromArgb(120, 122, 150);
            toggle.UncheckedState.InnerColor = Color.FromArgb(120, 122, 150);
            toggle.CheckedChanged += OnToggleChanged;
            //
            // chips
            //
            chips.BackColor = Color.Transparent;
            chips.Location = new Point(14, 14);
            chips.Name = "chips";
            chips.Size = new Size(200, 30);
            chips.TabIndex = 0;
            chips.WrapContents = false;
            //
            // TweakCard
            //
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(8, 8, 10);
            Controls.Add(surface);
            Margin = new Padding(0, 0, 10, 10);
            Name = "TweakCard";
            Size = new Size(292, 150);
            surface.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private Guna.UI2.WinForms.Guna2Panel surface;
        private FlowLayoutPanel chips;
        private Guna.UI2.WinForms.Guna2ToggleSwitch toggle;
        private CuoreUI.Controls.cuiLabel titleLabel;
        private Guna.UI2.WinForms.Guna2HtmlLabel descriptionLabel;
        private CuoreUI.Controls.cuiLabel readMoreLabel;
    }
}
