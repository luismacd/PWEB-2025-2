import sequelize from "../src/config/database.js";
import Usuario from "../src/models/user.js";
import Producto from "../src/models/producto.js";
import Orden from "../src/models/orden.js";
import OrdenProducto from "../src/models/ordenProducto.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión establecida");

    // Crear usuarios con estado
    const usuarios = await Promise.all([
      Usuario.create({
        nombre: "Andrea",
        apellido: "Admin",
        correo: "admin1@dashboard.com",
        dni: "00000001",
        password: "admin123",
        tipoUsuario: "admin",
        estado: "activo"
      }),
      Usuario.create({
        nombre: "Luis",
        apellido: "Pérez",
        correo: "luis1@correo.com",
        dni: "00000002",
        password: "usuario123",
        tipoUsuario: "usuario",
        estado: "activo"
      }),
      Usuario.create({
        nombre: "María",
        apellido: "Gómez",
        correo: "maria1@correo.com",
        dni: "00000003",
        password: "usuario123",
        tipoUsuario: "usuario",
        estado: "inactivo"
      })
    ]);

    console.log("✅ Usuarios creados");

    // ============================
    //     LISTA DE PRODUCTOS
    // ============================

    const productosLista = [
      // ======== VIDEOJUEGOS ========
      {
        nombre: "The Legend of Zelda: Tears of the Kingdom",
        categoria: "Videojuegos",
        precio: 229.99,
        imagen: "/zelda.jpg",
        stock: 0,
        descripcion: "Explora un vasto mundo lleno de aventuras y misterios en el nuevo capítulo de Zelda.",
        presentacion: ""
      },
      {
        nombre: "Super Mario Bros Wonder",
        categoria: "Videojuegos",
        precio: 209.99,
        imagen: "/mario-wonder.jpg",
        stock: 0,
        descripcion: "Vuelve Mario con nuevas transformaciones y niveles llenos de diversión.",
        presentacion: ""
      },
      {
        nombre: "Elden Ring",
        categoria: "Videojuegos",
        precio: 265.99,
        imagen: "/elden-ring.jpg",
        stock: 0,
        descripcion: "El galardonado RPG de acción con un extenso mundo abierto y combates desafiantes.",
        presentacion: ""
      },

      // ======== CONSOLAS ========
      {
        nombre: "Nintendo Switch OLED",
        categoria: "Consolas",
        precio: 1329.99,
        imagen: "/switch-oled.jpg",
        stock: 0,
        descripcion: "Versión OLED con pantalla vibrante y base mejorada.",
        presentacion: ""
      },
      {
        nombre: "PlayStation 5",
        categoria: "Consolas",
        precio: 2279.99,
        imagen: "/ps5.jpg",
        stock: 0,
        descripcion: "Consola de nueva generación con gráficos ultra realistas.",
        presentacion: ""
      },
      {
        nombre: "Xbox Series X",
        categoria: "Consolas",
        precio: 2203.99,
        imagen: "/xbox-series-x.jpg",
        stock: 0,
        descripcion: "La consola más potente de Xbox, con soporte 4K y rendimiento extremo.",
        presentacion: ""
      },

      // ======== PERIFÉRICOS ========
      {
        nombre: "Control Xbox Inalámbrico (Pro)",
        categoria: "Periféricos",
        precio: 949.99,
        imagen: "/xbox-controller.jpg",
        stock: 0,
        descripcion: "Control ergonómico con vibración háptica avanzada.",
        presentacion: ""
      },
      {
        nombre: "Teclado Mecánico RGB",
        categoria: "Periféricos",
        precio: 493.99,
        imagen: "/teclado-rgb.jpg",
        stock: 0,
        descripcion: "Teclado con switches de precisión e iluminación RGB.",
        presentacion: ""
      },
      {
        nombre: "Mouse Gamer Logitech G502",
        categoria: "Periféricos",
        precio: 341.99,
        imagen: "/mouse-g502.jpg",
        stock: 0,
        descripcion: "Mouse de precisión con sensor HERO y botones programables.",
        presentacion: ""
      },

      // ======== COLECCIONABLES ========
      {
        nombre: "Figura Link Edición Especial",
        categoria: "Coleccionables",
        precio: 151.99,
        imagen: "/link-figure.jpg",
        stock: 0,
        descripcion: "Figura detallada con base de exhibición.",
        presentacion: ""
      },
      {
        nombre: "Funko Pop Spider-Man",
        categoria: "Coleccionables",
        precio: 75.99,
        imagen: "/funko-spiderman.jpg",
        stock: 0,
        descripcion: "Figura coleccionable de Spider-Man estilo Funko.",
        presentacion: ""
      },
      {
        nombre: "Figura Pikachu de Resina",
        categoria: "Coleccionables",
        precio: 113.99,
        imagen: "/pikachu-figure.jpg",
        stock: 0,
        descripcion: "Figura hecha a mano con pintura detallada.",
        presentacion: ""
      },

      // ======== MEMBRESÍAS ========
      {
        nombre: "Nintendo Switch Online 12 meses",
        categoria: "Membresías",
        precio: 151.99,
        imagen: "/nintendo-online.jpg",
        stock: 0,
        descripcion: "Juego online y catálogo retro por un año.",
        presentacion: ""
      },
      {
        nombre: "PlayStation Plus Premium 12 meses",
        categoria: "Membresías",
        precio: 303.99,
        imagen: "/ps-plus.jpg",
        stock: 0,
        descripcion: "Juegos mensuales, anticipado y multijugador.",
        presentacion: ""
      },
      {
        nombre: "Xbox Game Pass Ultimate",
        categoria: "Membresías",
        precio: 227.99,
        imagen: "/game-pass.jpg",
        stock: 0,
        descripcion: "Más de 100 juegos para consola y PC.",
        presentacion: ""
      },

      // ======== MERCH ========
      {
        nombre: "Polera Zelda Trifuerza",
        categoria: "Merch",
        precio: 133.99,
        imagen: "/polera-zelda.jpg",
        stock: 0,
        descripcion: "Polera de algodón premium con diseño dorado.",
        presentacion: ""
      },
      {
        nombre: "Gorra Super Mario",
        categoria: "Merch",
        precio: 94.99,
        imagen: "/gorra-mario.jpg",
        stock: 0,
        descripcion: "Gorra roja con la clásica 'M'.",
        presentacion: ""
      },
      {
        nombre: "Mochila Pokémon Pikachu",
        categoria: "Merch",
        precio: 189.99,
        imagen: "/mochila-pokemon.jpg",
        stock: 0,
        descripcion: "Mochila espaciosa con estampado de Pikachu.",
        presentacion: ""
      },

      // ======== COMPONENTES PC ========
      {
        nombre: "Tarjeta Gráfica RTX 4070",
        categoria: "Componentes PC",
        precio: 3039.99,
        imagen: "/rtx4070.jpg",
        stock: 0,
        descripcion: "GPU de última generación con ray tracing.",
        presentacion: ""
      },
      {
        nombre: "Procesador Intel Core i7 13700K",
        categoria: "Componentes PC",
        precio: 1633.99,
        imagen: "/intel-i7.jpg",
        stock: 0,
        descripcion: "Procesador ideal para gaming y multitarea.",
        presentacion: ""
      },
      {
        nombre: "SSD NVMe 2TB Samsung 980 Pro",
        categoria: "Componentes PC",
        precio: 873.99,
        imagen: "/ssd-980pro.jpg",
        stock: 0,
        descripcion: "Unidad NVMe ultrarrápida.",
        presentacion: ""
      },

      // ======== JUGUETES ========
      {
        nombre: "LEGO Super Mario Starter Pack",
        categoria: "Juguetes",
        precio: 265.99,
        imagen: "/lego-mario.jpg",
        stock: 0,
        descripcion: "Set interactivo con figuras y niveles.",
        presentacion: ""
      },
      {
        nombre: "Figura articulada Sonic",
        categoria: "Juguetes",
        precio: 94.99,
        imagen: "/sonic-figure.jpg",
        stock: 0,
        descripcion: "Figura articulada con detalles fieles.",
        presentacion: ""
      },
      {
        nombre: "Pelota Pokéball oficial",
        categoria: "Juguetes",
        precio: 56.99,
        imagen: "/pokeball.jpg",
        stock: 0,
        descripcion: "Pelota coleccionable de alta calidad.",
        presentacion: ""
      }
    ];

    // Crear productos en la base
    const productos = [];
    for (const p of productosLista) {
      const created = await Producto.create(p);
      productos.push(created);
    }

    console.log("✅ Productos creados correctamente");

    // ============================
    //      CREACIÓN DE ÓRDENES
    // ============================

    // Orden Andrea
    const orden1 = await Orden.create({
      usuarioId: usuarios[0].id,
      estado: "pendiente",
      total: 0
    });

    await OrdenProducto.create({
      ordenId: orden1.id,
      productoId: productos[0].id,
      cantidad: 2,
      precioUnitario: 1500
    });

    await OrdenProducto.create({
      ordenId: orden1.id,
      productoId: productos[1].id,
      cantidad: 1,
      precioUnitario: 80
    });

    orden1.total = 1500 * 2 + 80;
    await orden1.save();

    // Actualizar stock
    productos[0].stock -= 2;
    productos[1].stock -= 1;
    await productos[0].save();
    await productos[1].save();

    // Orden Luis
    const orden2 = await Orden.create({
      usuarioId: usuarios[1].id,
      estado: "pagado",
      total: 0
    });

    await OrdenProducto.create({
      ordenId: orden2.id,
      productoId: productos[2].id,
      cantidad: 1,
      precioUnitario: 600
    });

    orden2.total = 600;
    await orden2.save();

    productos[2].stock -= 1;
    await productos[2].save();

    console.log("✅ Órdenes creadas y stock actualizado");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error al insertar datos:", err);
    process.exit(1);
  }
})();
