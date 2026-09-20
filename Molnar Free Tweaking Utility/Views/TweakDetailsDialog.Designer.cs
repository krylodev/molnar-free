namespace Molnar_Free_Tweaking_Utility.Views
{
    partial class TweakDetailsDialog
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
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            components = new System.ComponentModel.Container();
            formRounder = new CuoreUI.Components.cuiFormRounder();
            formDrag = new CuoreUI.Components.cuiFormDrag(components);
            headerPanel = new Guna.UI2.WinForms.Guna2Panel();
            closeBox = new Guna.UI2.WinForms.Guna2ControlBox();
            headerLabel = new CuoreUI.Controls.cuiLabel();
            titleLabel = new CuoreUI.Controls.cuiLabel();
            chips = new FlowLayoutPanel();
            descriptionLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            separator = new CuoreUI.Controls.cuiSeparator();
            changesLabel = new CuoreUI.Controls.cuiLabel();
            operationsHost = new Guna.UI2.WinForms.Guna2Panel();
            operationsLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            operationsScrollBar = new Guna.UI2.WinForms.Guna2VScrollBar();
            noteLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            headerPanel.SuspendLayout();
            operationsHost.SuspendLayout();
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
            // headerPanel
            //
            headerPanel.BorderRadius = 0;
            headerPanel.Controls.Add(closeBox);
            headerPanel.Controls.Add(headerLabel);
            headerPanel.CustomizableEdges = customizableEdges1;
            headerPanel.Dock = DockStyle.Top;
            headerPanel.FillColor = Color.FromArgb(13, 13, 16);
            headerPanel.Location = new Point(0, 0);
            headerPanel.Name = "headerPanel";
            headerPanel.ShadowDecoration.CustomizableEdges = customizableEdges2;
            headerPanel.Size = new Size(600, 36);
            headerPanel.TabIndex = 0;
            //
            // closeBox
            //
            closeBox.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            closeBox.Animated = true;
            closeBox.BackColor = Color.FromArgb(13, 13, 16);
            closeBox.Cursor = Cursors.Hand;
            closeBox.CustomizableEdges = customizableEdges3;
            closeBox.FillColor = Color.FromArgb(13, 13, 16);
            closeBox.HoverState.FillColor = Color.FromArgb(13, 13, 16);
            closeBox.HoverState.IconColor = Color.FromArgb(247, 243, 244);
            closeBox.IconColor = Color.FromArgb(97, 96, 104);
            closeBox.Location = new Point(566, 3);
            closeBox.Name = "closeBox";
            closeBox.PressedColor = Color.FromArgb(13, 13, 16);
            closeBox.ShadowDecoration.CustomizableEdges = customizableEdges4;
            closeBox.Size = new Size(30, 30);
            closeBox.TabIndex = 0;
            //
            // headerLabel
            //
            headerLabel.BackColor = Color.Transparent;
            headerLabel.Content = "OPTIMIZATION DETAILS";
            headerLabel.Font = new Font("Poppins SemiBold", 8F, FontStyle.Bold);
            headerLabel.ForeColor = Color.FromArgb(97, 96, 104);
            headerLabel.HorizontalAlignment = StringAlignment.Center;
            headerLabel.Location = new Point(0, 0);
            headerLabel.Name = "headerLabel";
            headerLabel.Size = new Size(600, 36);
            headerLabel.TabIndex = 1;
            headerLabel.VerticalAlignment = StringAlignment.Center;
            //
            // titleLabel
            //
            titleLabel.BackColor = Color.Transparent;
            titleLabel.Content = "Tweak name";
            titleLabel.Font = new Font("Poppins SemiBold", 13F, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(247, 243, 244);
            titleLabel.HorizontalAlignment = StringAlignment.Near;
            titleLabel.Location = new Point(24, 52);
            titleLabel.Name = "titleLabel";
            titleLabel.Size = new Size(552, 30);
            titleLabel.TabIndex = 1;
            titleLabel.VerticalAlignment = StringAlignment.Center;
            //
            // chips
            //
            chips.BackColor = Color.Transparent;
            chips.Location = new Point(24, 88);
            chips.Name = "chips";
            chips.Size = new Size(552, 30);
            chips.TabIndex = 2;
            chips.WrapContents = false;
            //
            // descriptionLabel
            //
            descriptionLabel.AutoSize = false;
            descriptionLabel.BackColor = Color.Transparent;
            descriptionLabel.Font = new Font("Poppins", 8.5F);
            descriptionLabel.ForeColor = Color.FromArgb(150, 150, 160);
            descriptionLabel.IsContextMenuEnabled = false;
            descriptionLabel.IsSelectionEnabled = false;
            descriptionLabel.Location = new Point(24, 126);
            descriptionLabel.Name = "descriptionLabel";
            descriptionLabel.Size = new Size(552, 44);
            descriptionLabel.TabIndex = 3;
            descriptionLabel.Text = "Description";
            //
            // separator
            //
            separator.BackColor = Color.Transparent;
            separator.ForeColor = Color.FromArgb(28, 28, 36);
            separator.Location = new Point(24, 178);
            separator.Name = "separator";
            separator.SeparatorMargin = 0;
            separator.Size = new Size(552, 2);
            separator.TabIndex = 4;
            separator.Thickness = 1F;
            separator.Vertical = false;
            //
            // changesLabel
            //
            changesLabel.BackColor = Color.Transparent;
            changesLabel.Content = "SYSTEM CHANGES";
            changesLabel.Font = new Font("Poppins SemiBold", 8F, FontStyle.Bold);
            changesLabel.ForeColor = Color.FromArgb(97, 96, 104);
            changesLabel.HorizontalAlignment = StringAlignment.Near;
            changesLabel.Location = new Point(24, 190);
            changesLabel.Name = "changesLabel";
            changesLabel.Size = new Size(552, 22);
            changesLabel.TabIndex = 5;
            changesLabel.VerticalAlignment = StringAlignment.Center;
            //
            // operationsHost
            //
            operationsHost.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            operationsHost.AutoScroll = true;
            operationsHost.BorderColor = Color.FromArgb(28, 28, 36);
            operationsHost.BorderRadius = 8;
            operationsHost.BorderThickness = 1;
            operationsHost.Controls.Add(operationsLabel);
            operationsHost.CustomizableEdges = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            operationsHost.FillColor = Color.FromArgb(13, 13, 16);
            operationsHost.Location = new Point(24, 216);
            operationsHost.Name = "operationsHost";
            operationsHost.Padding = new Padding(12, 10, 12, 10);
            operationsHost.ShadowDecoration.CustomizableEdges = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            operationsHost.Size = new Size(552, 196);
            operationsHost.TabIndex = 6;
            //
            // operationsLabel
            //
            operationsLabel.AutoSize = false;
            operationsLabel.AutoSizeHeightOnly = true;
            operationsLabel.BackColor = Color.Transparent;
            operationsLabel.Font = new Font("Poppins", 7.5F);
            operationsLabel.ForeColor = Color.FromArgb(150, 150, 160);
            operationsLabel.IsContextMenuEnabled = false;
            operationsLabel.IsSelectionEnabled = false;
            operationsLabel.Location = new Point(12, 10);
            operationsLabel.Name = "operationsLabel";
            operationsLabel.Size = new Size(510, 20);
            operationsLabel.TabIndex = 0;
            operationsLabel.Text = "";
            //
            // operationsScrollBar
            //
            operationsScrollBar.AutoRoundedCorners = true;
            operationsScrollBar.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Right;
            operationsScrollBar.BindingContainer = operationsHost;
            operationsScrollBar.InUpdate = false;
            operationsScrollBar.LargeChange = 10;
            operationsScrollBar.Location = new Point(582, 216);
            operationsScrollBar.Maximum = 100;
            operationsScrollBar.Name = "operationsScrollBar";
            operationsScrollBar.ScrollbarSize = 8;
            operationsScrollBar.Size = new Size(8, 196);
            operationsScrollBar.TabIndex = 7;
            operationsScrollBar.BorderColor = Color.FromArgb(13, 13, 16);
            operationsScrollBar.FillColor = Color.FromArgb(13, 13, 16);
            operationsScrollBar.HoverState.BorderColor = Color.FromArgb(13, 13, 16);
            operationsScrollBar.HoverState.FillColor = Color.FromArgb(13, 13, 16);
            operationsScrollBar.HoverState.ThumbColor = Color.FromArgb(70, 74, 100);
            operationsScrollBar.PressedState.BorderColor = Color.FromArgb(13, 13, 16);
            operationsScrollBar.PressedState.FillColor = Color.FromArgb(13, 13, 16);
            operationsScrollBar.PressedState.ThumbColor = Color.FromArgb(93, 110, 234);
            operationsScrollBar.ThumbColor = Color.FromArgb(46, 48, 64);
            operationsScrollBar.ThumbStyle = Guna.UI2.WinForms.Enums.ThumbStyle.Inset;
            //
            // noteLabel
            //
            noteLabel.Anchor = AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            noteLabel.AutoSize = false;
            noteLabel.BackColor = Color.Transparent;
            noteLabel.Font = new Font("Poppins", 8F);
            noteLabel.ForeColor = Color.FromArgb(253, 6, 87);
            noteLabel.IsContextMenuEnabled = false;
            noteLabel.IsSelectionEnabled = false;
            noteLabel.Location = new Point(24, 424);
            noteLabel.Name = "noteLabel";
            noteLabel.Size = new Size(552, 36);
            noteLabel.TabIndex = 8;
            noteLabel.Text = "";
            //
            // TweakDetailsDialog
            //
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(8, 8, 10);
            ClientSize = new Size(600, 476);
            Controls.Add(noteLabel);
            Controls.Add(operationsScrollBar);
            Controls.Add(operationsHost);
            Controls.Add(changesLabel);
            Controls.Add(separator);
            Controls.Add(descriptionLabel);
            Controls.Add(chips);
            Controls.Add(titleLabel);
            Controls.Add(headerPanel);
            Font = new Font("Poppins", 8.25F);
            ForeColor = Color.FromArgb(247, 243, 244);
            FormBorderStyle = FormBorderStyle.None;
            Name = "TweakDetailsDialog";
            ShowInTaskbar = false;
            StartPosition = FormStartPosition.CenterParent;
            Text = "Optimization details";
            operationsHost.ResumeLayout(false);
            headerPanel.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private CuoreUI.Components.cuiFormRounder formRounder;
        private CuoreUI.Components.cuiFormDrag formDrag;
        private Guna.UI2.WinForms.Guna2Panel headerPanel;
        private Guna.UI2.WinForms.Guna2ControlBox closeBox;
        private CuoreUI.Controls.cuiLabel headerLabel;
        private CuoreUI.Controls.cuiLabel titleLabel;
        private FlowLayoutPanel chips;
        private Guna.UI2.WinForms.Guna2HtmlLabel descriptionLabel;
        private CuoreUI.Controls.cuiSeparator separator;
        private CuoreUI.Controls.cuiLabel changesLabel;
        private Guna.UI2.WinForms.Guna2Panel operationsHost;
        private Guna.UI2.WinForms.Guna2HtmlLabel operationsLabel;
        private Guna.UI2.WinForms.Guna2VScrollBar operationsScrollBar;
        private Guna.UI2.WinForms.Guna2HtmlLabel noteLabel;
    }
}
