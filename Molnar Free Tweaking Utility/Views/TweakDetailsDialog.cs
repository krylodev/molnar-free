using System.Net;
using System.Text;
using Molnar_Free_Tweaking_Utility.Controls;
using Molnar_Free_Tweaking_Utility.Core;

namespace Molnar_Free_Tweaking_Utility.Views
{
    public partial class TweakDetailsDialog : Form
    {
        public TweakDetailsDialog(Tweak tweak)
        {
            InitializeComponent();

            titleLabel.Content = tweak.Name;
            descriptionLabel.Text = tweak.Description;
            operationsLabel.Text = Describe(tweak.Apply);

            foreach (var category in tweak.CategoryInfos)
                chips.Controls.Add(new CategoryChip { Category = category });

            noteLabel.Text = tweak.OneWay
                ? $"This optimization cannot be reverted automatically. {tweak.Note}".Trim()
                : "";
        }

        private static string Describe(IEnumerable<TweakOperation> operations)
        {
            var builder = new StringBuilder();
            foreach (var op in operations)
                builder.Append(Line(op)).Append("<br>");
            return builder.ToString();
        }

        private static string Line(TweakOperation op) => op.Kind switch
        {
            "regset" => Row("SET", $"{op.Path}\\{ValueName(op.Value)}", $"{op.Data} ({op.ValueType})"),
            "regdel" => Row("REMOVE", $"{op.Path}\\{ValueName(op.Value)}", ""),
            "regclear" => Row("CLEAR", op.Path, "all values"),
            "regdelkey" => Row("REMOVE KEY", op.Path, ""),
            "gpuset" => Row("GPU", $"NVIDIA display adapters\\{op.Value}", $"{op.Data} ({op.ValueType})"),
            "delfile" => Row("DELETE", op.Path, op.Recursive ? "recursive" : ""),
            "deldir" => Row("DELETE FOLDER", op.Path, ""),
            "kill" => Row("STOP", op.Path, ""),
            "exec" => Row("RUN", op.FileName, op.Arguments),
            _ => Encode(op.Kind)
        };

        private static string Row(string verb, string target, string detail)
        {
            string tail = detail.Length > 0 ? $" <span color=\"#616068\">&#8594; {Encode(detail)}</span>" : "";
            return $"<span color=\"#5D6EEA\">{Encode(verb)}</span>  {Encode(target)}{tail}";
        }

        private static string ValueName(string value) => value.Length > 0 ? value : "(Default)";

        private static string Encode(string value) => WebUtility.HtmlEncode(value);
    }
}
