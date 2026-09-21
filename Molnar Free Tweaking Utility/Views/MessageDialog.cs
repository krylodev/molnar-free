using System.Net;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Views
{
    public partial class MessageDialog : Form
    {
        public MessageDialog(string title, string message, bool confirm)
        {
            InitializeComponent();
            Render.EnableDoubleBuffer(this);

            titleLabel.Text = WebUtility.HtmlEncode(title);
            messageLabel.Text = WebUtility.HtmlEncode(message).ReplaceLineEndings("<br>");

            if (confirm) return;
            secondaryButton.Visible = false;
            primaryButton.Text = "OK";
            primaryButton.DialogResult = DialogResult.OK;
            CancelButton = primaryButton;
        }

        protected override void OnLoad(EventArgs e)
        {
            ClientSize = new Size(ClientSize.Width, messageLabel.Bottom + 80);
            base.OnLoad(e);
        }
    }
}
