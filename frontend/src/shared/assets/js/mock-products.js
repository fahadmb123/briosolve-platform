/**
 * Product Marketplace Mock Data & Services
 */

const INITIAL_MOCK_PRODUCTS = {
    categories: [
        { id: 'pcat_electrical', name: 'Electrical Parts', status: 'ACTIVE' },
        { id: 'pcat_plumbing', name: 'Plumbing Parts', status: 'ACTIVE' },
        { id: 'pcat_ac', name: 'AC Parts', status: 'ACTIVE' },
        { id: 'pcat_cleaning', name: 'Cleaning Products', status: 'ACTIVE' },
        { id: 'pcat_tools', name: 'Tools', status: 'ACTIVE' },
        { id: 'pcat_accessories', name: 'Service Accessories', status: 'ACTIVE' }
    ],
    products: [
        {
            id: 'prod_1',
            name: 'Premium AC Foam Cleaner',
            categoryId: 'pcat_ac',
            description: 'Professional grade foaming coil cleaner for split and window ACs. Removes dirt, grease, and grime without harsh scrubbing.',
            price: 450,
            stock: 25,
            status: 'ACTIVE',
            image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&auto=format&fit=crop&q=80'
        },
        {
            id: 'prod_2',
            name: 'Copper Pipe (1 Meter)',
            categoryId: 'pcat_plumbing',
            description: 'High-quality copper piping suitable for water lines and HVAC installations.',
            price: 320,
            stock: 50,
            status: 'ACTIVE',
            image: 'https://images.unsplash.com/photo-1584984282713-90d5bc515f45?w=400&auto=format&fit=crop&q=80'
        },
        {
            id: 'prod_3',
            name: 'Multi-Tool Kit 46 Piece',
            categoryId: 'pcat_tools',
            description: 'Comprehensive mechanical and home repair toolkit with spanners, ratchets, and sockets.',
            price: 1800,
            stock: 12,
            status: 'ACTIVE',
            image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&auto=format&fit=crop&q=80'
        },
        {
            id: 'prod_4',
            name: 'Heavy Duty Drain Cleaner',
            categoryId: 'pcat_cleaning',
            description: 'Fast-acting formula to dissolve hair, grease, and soap scum blockages.',
            price: 250,
            stock: 0, // OUT OF STOCK
            status: 'ACTIVE',
            image: 'https://images.unsplash.com/photo-1585501861962-d261cc2eecb0?w=400&auto=format&fit=crop&q=80'
        },
        {
            id: 'prod_5',
            name: 'Smart WiFi Switch',
            categoryId: 'pcat_electrical',
            description: 'Automate your home lighting. Compatible with Alexa and Google Home.',
            price: 850,
            stock: 30,
            status: 'ACTIVE',
            image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&auto=format&fit=crop&q=80'
        },
        {
            id: 'prod_6',
            name: 'Generic 5A Socket',
            categoryId: 'pcat_electrical',
            description: 'Standard wall socket replacement part.',
            price: 120,
            stock: 100,
            status: 'INACTIVE', // INACTIVE
            image: 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=400&auto=format&fit=crop&q=80'
        }
    ],
    cart: [],
    orders: []
};

// Initialize or load from LocalStorage
function initProductStore() {
    if (!localStorage.getItem('products_db')) {
        localStorage.setItem('products_db', JSON.stringify(INITIAL_MOCK_PRODUCTS));
    }
}

// Ensure init on load
initProductStore();

class ProductService {
    static getDB() {
        return JSON.parse(localStorage.getItem('products_db'));
    }

    static saveDB(db) {
        localStorage.setItem('products_db', JSON.stringify(db));
    }

    // --- PRODUCTS ---
    static getProducts(onlyActive = false) {
        const db = this.getDB();
        if (onlyActive) {
            return db.products.filter(p => p.status === 'ACTIVE');
        }
        return db.products;
    }

    static getProduct(id) {
        return this.getDB().products.find(p => p.id === id);
    }

    static updateProduct(updatedProduct) {
        const db = this.getDB();
        const index = db.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            db.products[index] = updatedProduct;
            this.saveDB(db);
        }
    }

    static addProduct(product) {
        const db = this.getDB();
        product.id = 'prod_' + Date.now();
        db.products.push(product);
        this.saveDB(db);
    }

    // --- CATEGORIES ---
    static getCategories() {
        return this.getDB().categories;
    }

    // --- CART ---
    static getCart() {
        return this.getDB().cart || [];
    }

    static addToCart(productId, quantity = 1) {
        const db = this.getDB();
        const product = db.products.find(p => p.id === productId);
        
        if (!product || product.status !== 'ACTIVE' || product.stock <= 0) return false;

        let cartItem = db.cart.find(item => item.productId === productId);
        if (cartItem) {
            if (cartItem.quantity + quantity > product.stock) {
                cartItem.quantity = product.stock; // Cap at max stock
            } else {
                cartItem.quantity += quantity;
            }
        } else {
            let addQty = quantity > product.stock ? product.stock : quantity;
            db.cart.push({ productId, quantity: addQty });
        }
        this.saveDB(db);
        return true;
    }

    static updateCartQuantity(productId, quantity) {
        const db = this.getDB();
        const product = db.products.find(p => p.id === productId);
        if (!product) return false;

        let cartItem = db.cart.find(item => item.productId === productId);
        if (cartItem) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
                return;
            }
            if (quantity > product.stock) {
                cartItem.quantity = product.stock;
            } else {
                cartItem.quantity = quantity;
            }
            this.saveDB(db);
        }
    }

    static removeFromCart(productId) {
        const db = this.getDB();
        db.cart = db.cart.filter(item => item.productId !== productId);
        this.saveDB(db);
    }

    static clearCart() {
        const db = this.getDB();
        db.cart = [];
        this.saveDB(db);
    }

    static getCartTotal() {
        const db = this.getDB();
        let total = 0;
        db.cart.forEach(item => {
            const prod = db.products.find(p => p.id === item.productId);
            if (prod) {
                total += (prod.price * item.quantity);
            }
        });
        return total;
    }

    // --- ORDERS ---
    static placeOrder(customerDetails, deliveryAddress) {
        const db = this.getDB();
        
        if (db.cart.length === 0) return null;

        // Final check stock
        for (let item of db.cart) {
            let prod = db.products.find(p => p.id === item.productId);
            if (!prod || prod.stock < item.quantity) {
                return { error: `Product ${prod ? prod.name : item.productId} doesn't have enough stock.` };
            }
        }

        const total = this.getCartTotal();
        const orderItems = db.cart.map(item => {
            let prod = db.products.find(p => p.id === item.productId);
            return {
                productId: item.productId,
                name: prod.name,
                price: prod.price,
                quantity: item.quantity
            };
        });

        const order = {
            id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toISOString(),
            status: 'PLACED',
            items: orderItems,
            total: total,
            customer: customerDetails,
            address: deliveryAddress
        };

        // Deduct stock
        db.cart.forEach(item => {
            let prod = db.products.find(p => p.id === item.productId);
            prod.stock -= item.quantity;
        });

        db.orders.unshift(order);
        db.cart = []; // Empty cart
        this.saveDB(db);
        return { success: true, orderId: order.id };
    }

    static getOrders() {
        return this.getDB().orders || [];
    }
    
    static getOrder(id) {
        return this.getDB().orders.find(o => o.id === id);
    }

    static updateOrderStatus(orderId, newStatus) {
        const db = this.getDB();
        let order = db.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            this.saveDB(db);
        }
    }
}

window.ProductService = ProductService;
