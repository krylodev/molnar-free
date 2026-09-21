namespace Molnar_Free_Tweaking_Utility.Views
{
    partial class MessageDialog
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
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges1 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges2 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges3 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            Guna.UI2.WinForms.Suite.CustomizableEdges customizableEdges4 = new Guna.UI2.WinForms.Suite.CustomizableEdges();
            formRounder = new CuoreUI.Components.cuiFormRounder();
            formDrag = new CuoreUI.Components.cuiFormDrag(components);
            titleLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            messageLabel = new Guna.UI2.WinForms.Guna2HtmlLabel();
            primaryButton = new Guna.UI2.WinForms.Guna2Button();
            secondaryButton = new Guna.UI2.WinForms.Guna2Button();
            SuspendLayout();
            //
            // formRounder
            //
            formRounder.OutlineColor = Color.FromArgb(38, 38, 50);
            formRounder.Rounding = 12;
            formRounder.TargetForm = this;
            //
            // formDrag
            //
            formDrag.TargetForm = this;
            //
            // titleLabel
            //
            titleLabel.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            titleLabel.AutoSize = false;
            titleLabel.BackColor = Color.FromArgb(13, 13, 16);
            titleLabel.Font = new Font("Poppins SemiBold", 11F, FontStyle.Bold);
            titleLabel.ForeColor = Color.FromArgb(247, 243, 244);
            titleLabel.Location = new Point(24, 20);
            titleLabel.Name = "titleLabel";
            titleLabel.Size = new Size(392, 28);
            titleLabel.TabIndex = 0;
            titleLabel.Text = "Title";
            titleLabel.TextAlignment = ContentAlignment.MiddleLeft;
            //
            // messageLabel
            //
            messageLabel.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            messageLabel.AutoSize = true;
            messageLabel.AutoSizeHeightOnly = true;
            messageLabel.BackColor = Color.FromArgb(13, 13, 16);
            messageLabel.Font = new Font("Poppins", 8.5F);
            messageLabel.ForeColor = Color.FromArgb(150, 150, 160);
            messageLabel.IsContextMenuEnabled = false;
            messageLabel.IsSelectionEnabled = false;
            messageLabel.Location = new Point(24, 54);
            messageLabel.MaximumSize = new Size(392, 0);
            messageLabel.Name = "messageLabel";
            messageLabel.Size = new Size(392, 40);
            messageLabel.TabIndex = 1;
            messageLabel.Text = "Message";
            //
            // primaryButton
            //
            primaryButton.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            primaryButton.Animated = true;
            primaryButton.BorderColor = Color.FromArgb(93, 110, 234);
            primaryButton.BorderRadius = 8;
            primaryButton.BorderThickness = 1;
            primaryButton.Cursor = Cursors.Hand;
            primaryButton.CustomizableEdges = customizableEdges1;
            primaryButton.DialogResult = DialogResult.Yes;
            primaryButton.FillColor = Color.FromArgb(93, 110, 234);
            primaryButton.Font = new Font("Poppins", 8.5F);
            primaryButton.ForeColor = Color.FromArgb(247, 243, 244);
            primaryButton.HoverState.BorderColor = Color.FromArgb(120, 134, 242);
            primaryButton.HoverState.FillColor = Color.FromArgb(120, 134, 242);
            primaryButton.HoverState.ForeColor = Color.FromArgb(247, 243, 244);
            primaryButton.Location = new Point(306, 114);
            primaryButton.Name = "primaryButton";
            primaryButton.PressedColor = Color.FromArgb(93, 110, 234);
            primaryButton.ShadowDecoration.CustomizableEdges = customizableEdges2;
            primaryButton.Size = new Size(110, 36);
            primaryButton.TabIndex = 2;
            primaryButton.Text = "Yes";
            //
            // secondaryButton
            //
            secondaryButton.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            secondaryButton.Animated = true;
            secondaryButton.BorderColor = Color.FromArgb(38, 38, 50);
            secondaryButton.BorderRadius = 8;
            secondaryButton.BorderThickness = 1;
            secondaryButton.Cursor = Cursors.Hand;
            secondaryButton.CustomizableEdges = customizableEdges3;
            secondaryButton.DialogResult = DialogResult.No;
            secondaryButton.FillColor = Color.FromArgb(22, 22, 28);
            secondaryButton.Font = new Font("Poppins", 8.5F);
            secondaryButton.ForeColor = Color.FromArgb(247, 243, 244);
            secondaryButton.HoverState.BorderColor = Color.FromArgb(46, 48, 64);
            secondaryButton.HoverState.FillColor = Color.FromArgb(32, 32, 42);
            secondaryButton.HoverState.ForeColor = Color.FromArgb(247, 243, 244);
            secondaryButton.Location = new Point(186, 114);
            secondaryButton.Name = "secondaryButton";
            secondaryButton.PressedColor = Color.FromArgb(32, 32, 42);
            secondaryButton.ShadowDecoration.CustomizableEdges = customizableEdges4;
            secondaryButton.Size = new Size(110, 36);
            secondaryButton.TabIndex = 3;
            secondaryButton.Text = "No";
            //
            // MessageDialog
            //
            AcceptButton = primaryButton;
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(13, 13, 16);
            CancelButton = secondaryButton;
            ClientSize = new Size(440, 174);
            Controls.Add(secondaryButton);
            Controls.Add(primaryButton);
            Controls.Add(messageLabel);
            Controls.Add(titleLabel);
            Font = new Font("Poppins", 8.25F);
            ForeColor = Color.FromArgb(247, 243, 244);
            FormBorderStyle = FormBorderStyle.None;
            Name = "MessageDialog";
            ShowInTaskbar = false;
            StartPosition = FormStartPosition.CenterParent;
            Text = "Molnar";
            ResumeLayout(false);
        }

        #endregion

        private CuoreUI.Components.cuiFormRounder formRounder;
        private CuoreUI.Components.cuiFormDrag formDrag;
        private Guna.UI2.WinForms.Guna2HtmlLabel titleLabel;
        private Guna.UI2.WinForms.Guna2HtmlLabel messageLabel;
        private Guna.UI2.WinForms.Guna2Button primaryButton;
        private Guna.UI2.WinForms.Guna2Button secondaryButton;
    }
}
