using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Smart_grocery_shop
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            LoadProducts();
        }

        private void LoadProducts()
        {
            using (var db = new ProductDbContext())
            {
                ProductDataGrid.ItemsSource = db.Products.ToList();
            }
        }


        private void AddProduct_Click(object sender, RoutedEventArgs e)
        {
            if (!string.IsNullOrEmpty(txtName.Text) && double.TryParse(txtPrice.Text, out double price) && int.TryParse(txtStock.Text, out int stock))
            {
                using (var db = new ProductDbContext())
                {
                    var product = new Product { Name = txtName.Text, Price = price, Stock = stock };
                    db.Products.Add(product);
                    db.SaveChanges();
                }

                LoadProducts();
                ClearFields();
            }
            else
            {
                MessageBox.Show("Invalid Input. Please check Name, Price, and Stock fields.");
            }
        }


        private void UpdateProduct_Click(object sender, RoutedEventArgs e)
        {
            if (ProductDataGrid.SelectedItem is Product selectedProduct)
            {
                using (var db = new ProductDbContext())
                {
                    var product = db.Products.Find(selectedProduct.Id);
                    if (product != null)
                    {
                        product.Name = txtName.Text;
                        product.Price = double.Parse(txtPrice.Text);
                        product.Stock = int.Parse(txtStock.Text);
                        db.SaveChanges();
                    }
                }

                LoadProducts();
                ClearFields();
            }
            else
            {
                MessageBox.Show("Please select a product to update.");
            }
        }


        private void DeleteProduct_Click(object sender, RoutedEventArgs e)
        {
            if (ProductDataGrid.SelectedItem is Product selectedProduct)
            {
                using (var db = new ProductDbContext())
                {
                    var product = db.Products.Find(selectedProduct.Id);
                    if (product != null)
                    {
                        db.Products.Remove(product);
                        db.SaveChanges();
                    }
                }

                LoadProducts();
                ClearFields();
            }
            else
            {
                MessageBox.Show("Please select a product to delete.");
            }
        }


        private void ProductDataGrid_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ProductDataGrid.SelectedItem is Product selectedProduct)
            {
                txtName.Text = selectedProduct.Name;
                txtPrice.Text = selectedProduct.Price.ToString();
                txtStock.Text = selectedProduct.Stock.ToString();
            }
        }


        private void ClearFields()
        {
            txtName.Clear();
            txtPrice.Clear();
            txtStock.Clear();
        }
    }
}
