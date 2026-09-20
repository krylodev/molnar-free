using System.ComponentModel;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Controls
{
    public partial class CategoryChip : UserControl
    {
        private CategoryInfo? category;

        public CategoryChip()
        {
            InitializeComponent();
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public CategoryInfo? Category
        {
            get => category;
            set
            {
                category = value;
                if (value is null) return;

                icon.Content = value.Icon;
                icon.ImageTint = value.Color;
                tooltip.Content = value.Display;
            }
        }
    }
}
