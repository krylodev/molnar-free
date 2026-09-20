namespace Molnar_Free_Tweaking_Utility.Views
{
    partial class OptimizationsView
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
            searchBox = new CuoreUI.Controls.cuiTextBox();
            filterBox = new CuoreUI.Controls.cuiComboBox();
            countLabel = new CuoreUI.Controls.cuiLabel();
            cardsHost = new Guna.UI2.WinForms.Guna2Panel();
            cardsPanel = new FlowLayoutPanel();
            scrollBar = new Guna.UI2.WinForms.Guna2VScrollBar();
            emptyLabel = new CuoreUI.Controls.cuiLabel();
            cardsHost.SuspendLayout();
            SuspendLayout();
            // 
            // searchBox
            // 
            searchBox.BackColor = Color.Transparent;
            searchBox.BackgroundColor = Color.FromArgb(17, 17, 22);
            searchBox.Content = "";
            searchBox.FocusBackgroundColor = Color.FromArgb(17, 17, 22);
            searchBox.FocusImageTint = Color.FromArgb(247, 243, 244);
            searchBox.FocusOutlineColor = Color.FromArgb(93, 110, 234);
            searchBox.Font = new Font("Poppins", 8.5F);
            searchBox.ForeColor = Color.FromArgb(247, 243, 244);
            searchBox.Image = Properties.Resources.Search;
            searchBox.ImageExpand = new Point(5, 5);
            searchBox.ImageOffset = new Point(0, 0);
            searchBox.Location = new Point(24, 18);
            searchBox.Margin = new Padding(4);
            searchBox.Multiline = false;
            searchBox.Name = "searchBox";
            searchBox.NormalImageTint = Color.FromArgb(97, 96, 104);
            searchBox.OutlineColor = Color.FromArgb(28, 28, 36);
            searchBox.Padding = new Padding(47, 11, 47, 0);
            searchBox.PasswordChar = false;
            searchBox.PlaceholderColor = Color.FromArgb(97, 96, 104);
            searchBox.PlaceholderText = "Search";
            searchBox.Rounding = new Padding(8);
            searchBox.Size = new Size(320, 38);
            searchBox.TabIndex = 0;
            searchBox.TextOffset = new Size(30, 0);
            searchBox.UnderlinedStyle = true;
            searchBox.ContentChanged += OnFilterChanged;
            // 
            // filterBox
            // 
            filterBox.BackColor = Color.Transparent;
            filterBox.BackgroundColor = Color.FromArgb(17, 17, 22);
            filterBox.Cursor = Cursors.Hand;
            filterBox.DropDownBackgroundColor = Color.FromArgb(13, 13, 16);
            filterBox.DropDownForeColor = Color.FromArgb(247, 243, 244);
            filterBox.ExpandArrowColor = Color.FromArgb(97, 96, 104);
            filterBox.Font = new Font("Poppins", 8.5F);
            filterBox.ForeColor = Color.FromArgb(247, 243, 244);
            filterBox.Items = new string[]
    {
    "Item 1",
    "Item 2",
    "Item 3"
    };
            filterBox.Location = new Point(356, 18);
            filterBox.Margin = new Padding(4, 3, 4, 3);
            filterBox.MaxDropDownHeight = 320;
            filterBox.Name = "filterBox";
            filterBox.NoSelectionText = "All";
            filterBox.OutlineColor = Color.FromArgb(28, 28, 36);
            filterBox.OutlineThickness = 1F;
            filterBox.Rounding = 8;
            filterBox.SelectedIndex = 0;
            filterBox.SelectedItem = "Item 1";
            filterBox.Size = new Size(170, 38);
            filterBox.SortAlphabetically = false;
            filterBox.TabIndex = 1;
            filterBox.SelectedIndexChanged += OnFilterChanged;
            // 
            // countLabel
            // 
            countLabel.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            countLabel.BackColor = Color.Transparent;
            countLabel.Content = "0\\ of\\ 0";
            countLabel.Font = new Font("Poppins", 8F);
            countLabel.ForeColor = Color.FromArgb(97, 96, 104);
            countLabel.HorizontalAlignment = StringAlignment.Far;
            countLabel.Location = new Point(716, 18);
            countLabel.Margin = new Padding(4, 3, 4, 3);
            countLabel.Name = "countLabel";
            countLabel.Size = new Size(258, 38);
            countLabel.TabIndex = 2;
            countLabel.VerticalAlignment = StringAlignment.Center;
            // 
            // cardsHost
            // 
            cardsHost.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            cardsHost.Controls.Add(cardsPanel);
            cardsHost.CustomizableEdges = customizableEdges1;
            cardsHost.FillColor = Color.FromArgb(8, 8, 10);
            cardsHost.Location = new Point(24, 68);
            cardsHost.Name = "cardsHost";
            cardsHost.ShadowDecoration.CustomizableEdges = customizableEdges2;
            cardsHost.Size = new Size(940, 526);
            cardsHost.TabIndex = 3;
            // 
            // cardsPanel
            // 
            cardsPanel.AutoScroll = true;
            cardsPanel.BackColor = Color.FromArgb(8, 8, 10);
            cardsPanel.Location = new Point(0, 0);
            cardsPanel.Name = "cardsPanel";
            cardsPanel.Size = new Size(957, 526);
            cardsPanel.TabIndex = 0;
            // 
            // scrollBar
            // 
            scrollBar.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Right;
            scrollBar.AutoRoundedCorners = true;
            scrollBar.BindingContainer = cardsPanel;
            scrollBar.BorderColor = Color.FromArgb(8, 8, 10);
            scrollBar.BorderRadius = 3;
            scrollBar.FillColor = Color.FromArgb(8, 8, 10);
            scrollBar.HoverState.BorderColor = Color.FromArgb(8, 8, 10);
            scrollBar.HoverState.FillColor = Color.FromArgb(8, 8, 10);
            scrollBar.HoverState.ThumbColor = Color.FromArgb(70, 74, 100);
            scrollBar.InUpdate = false;
            scrollBar.LargeChange = 10;
            scrollBar.Location = new Point(972, 68);
            scrollBar.Name = "scrollBar";
            scrollBar.PressedState.BorderColor = Color.FromArgb(8, 8, 10);
            scrollBar.PressedState.FillColor = Color.FromArgb(8, 8, 10);
            scrollBar.PressedState.ThumbColor = Color.FromArgb(93, 110, 234);
            scrollBar.ScrollbarSize = 8;
            scrollBar.Size = new Size(8, 526);
            scrollBar.TabIndex = 4;
            scrollBar.ThumbColor = Color.FromArgb(46, 48, 64);
            scrollBar.ThumbStyle = Guna.UI2.WinForms.Enums.ThumbStyle.Inset;
            // 
            // emptyLabel
            // 
            emptyLabel.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            emptyLabel.BackColor = Color.Transparent;
            emptyLabel.Content = "No\\ optimizations\\ match\\ your\\ search\\.";
            emptyLabel.Font = new Font("Poppins", 9F);
            emptyLabel.ForeColor = Color.FromArgb(97, 96, 104);
            emptyLabel.HorizontalAlignment = StringAlignment.Center;
            emptyLabel.Location = new Point(24, 240);
            emptyLabel.Margin = new Padding(4, 3, 4, 3);
            emptyLabel.Name = "emptyLabel";
            emptyLabel.Size = new Size(940, 30);
            emptyLabel.TabIndex = 5;
            emptyLabel.VerticalAlignment = StringAlignment.Center;
            emptyLabel.Visible = false;
            // 
            // OptimizationsView
            // 
            AutoScaleMode = AutoScaleMode.None;
            BackColor = Color.FromArgb(8, 8, 10);
            Controls.Add(emptyLabel);
            Controls.Add(scrollBar);
            Controls.Add(cardsHost);
            Controls.Add(countLabel);
            Controls.Add(filterBox);
            Controls.Add(searchBox);
            Name = "OptimizationsView";
            Size = new Size(1000, 610);
            cardsHost.ResumeLayout(false);
            ResumeLayout(false);
        }

        #endregion

        private CuoreUI.Controls.cuiTextBox searchBox;
        private CuoreUI.Controls.cuiComboBox filterBox;
        private CuoreUI.Controls.cuiLabel countLabel;
        private Guna.UI2.WinForms.Guna2Panel cardsHost;
        private FlowLayoutPanel cardsPanel;
        private Guna.UI2.WinForms.Guna2VScrollBar scrollBar;
        private CuoreUI.Controls.cuiLabel emptyLabel;
    }
}
