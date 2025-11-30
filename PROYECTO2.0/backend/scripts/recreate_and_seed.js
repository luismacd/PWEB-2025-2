import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../src/config/database.js';
import Usuario from '../src/models/user.js';
import Producto from '../src/models/producto.js';
import Orden from '../src/models/orden.js';
import OrdenProducto from '../src/models/ordenProducto.js';

// bcrypt may fail to install on some Windows setups; try to import native bcrypt
// and fall back to bcryptjs which is a pure-JS implementation.
let bcrypt;
try {
  // dynamic import to allow optional dependency
  const bmod = await import('bcrypt');
  bcrypt = bmod.default || bmod;
} catch (e) {
  const bmod = await import('bcryptjs');
  bcrypt = bmod.default || bmod;
}

async function run() {
  try {
    console.log('🔁 Iniciando sync({ force: true }) — se recrearán las tablas');
    await sequelize.sync({ force: true });
    console.log('✅ Tablas recreadas. Ejecutando seed...');

    // Hashear contraseñas antes de insertar
    const passAdmin = await bcrypt.hash('admin123', 10);
    const passUser = await bcrypt.hash('usuario123', 10);

    // Crear usuarios con estado
    const usuarios = await Promise.all([
      Usuario.create({
        nombre: 'Andrea',
        apellido: 'Admin',
        direccion: 'Calle Falsa 123',
        calle: 'Calle Falsa',
        correo: 'admin@dashboard.com',
        password: passAdmin,
        tipoUsuario: 'admin',
        estado: 'activo'
      }),
      Usuario.create({
        nombre: 'Luis',
        apellido: 'Pérez',
        direccion: 'Calle Falsa 123',
        calle: 'Calle Falsa',
        correo: 'luis@correo.com',
        password: passUser,
        tipoUsuario: 'usuario',
        estado: 'activo'
      }),
      Usuario.create({
        nombre: 'María',
        apellido: 'Gómez',
        direccion: 'Calle Falsa 123',
        calle: 'Calle Falsa',
        correo: 'maria@correo.com',
        password: passUser,
        tipoUsuario: 'usuario',
        estado: 'inactivo'
      })
    ]);
    console.log('✅ Usuarios creados');

    // Crear productos usando la lista proporcionada
    const productosLista = [
      { nombre: "The Legend of Zelda: Tears of the Kingdom", categoria: "Videojuegos", precio: 229.99, imagen: "/zelda.jpg", stock: 0, descripcion: "Explora un vasto mundo lleno de aventuras y misterios en el nuevo capítulo de Zelda.", presentacion: "" },
      { nombre: "Super Mario Bros Wonder", categoria: "Videojuegos", precio: 209.99, imagen: "/mario-wonder.jpg", stock: 0, descripcion: "Vuelve Mario con nuevas transformaciones y niveles llenos de diversión para toda la familia.", presentacion: "" },
      { nombre: "Elden Ring", categoria: "Videojuegos", precio: 265.99, imagen: "/elden-ring.jpg", stock: 0, descripcion: "El galardonado RPG de acción con un extenso mundo abierto y combates desafiantes.", presentacion: "" },
      { nombre: "Nintendo Switch OLED", categoria: "Consolas", precio: 1329.99, imagen: "/switch-oled.jpg", stock: 0, descripcion: "Versión OLED con pantalla más vibrante y base mejorada para disfrutar tus juegos favoritos.", presentacion: "" },
      { nombre: "PlayStation 5", categoria: "Consolas", precio: 2279.99, imagen: "/ps5.jpg", stock: 0, descripcion: "Consola de nueva generación con gráficos ultra realistas y velocidad de carga increíble.", presentacion: "" },
      { nombre: "Xbox Series X", categoria: "Consolas", precio: 2203.99, imagen: "/xbox-series-x.jpg", stock: 0, descripcion: "La consola más potente de Xbox, con soporte 4K y rendimiento de próxima generación.", presentacion: "" },
      { nombre: "Control Xbox Inalámbrico (Pro)", categoria: "Periféricos", precio: 949.99, imagen: "/xbox-controller.jpg", stock: 0, descripcion: "Control ergonómico con conexión inalámbrica y vibración háptica avanzada.", presentacion: "" },
      { nombre: "Teclado Mecánico RGB", categoria: "Periféricos", precio: 493.99, imagen: "/teclado-rgb.jpg", stock: 0, descripcion: "Teclado mecánico retroiluminado con switches de alta precisión para gaming.", presentacion: "" },
      { nombre: "Mouse Gamer Logitech G502", categoria: "Periféricos", precio: 341.99, imagen: "/mouse-g502.jpg", stock: 0, descripcion: "Mouse de precisión con sensor HERO y hasta 11 botones programables.", presentacion: "" },
      { nombre: "Figura Link Edición Especial", categoria: "Coleccionables", precio: 151.99, imagen: "/link-figure.jpg", stock: 0, descripcion: "Figura detallada de Link con base de exhibición, ideal para fans de Zelda.", presentacion: "" },
      { nombre: "Funko Pop Spider-Man", categoria: "Coleccionables", precio: 75.99, imagen: "/funko-spiderman.jpg", stock: 0, descripcion: "Figura coleccionable estilo Funko Pop del icónico héroe de Marvel.", presentacion: "" },
      { nombre: "Figura Pikachu de Resina", categoria: "Coleccionables", precio: 113.99, imagen: "/pikachu-figure.jpg", stock: 0, descripcion: "Figura hecha a mano de Pikachu, con pintura detallada y acabado brillante.", presentacion: "" },
      { nombre: "Nintendo Switch Online 12 meses", categoria: "Membresías", precio: 151.99, imagen: "/nintendo-online.jpg", stock: 0, descripcion: "Accede al juego en línea y catálogo retro de Nintendo durante un año completo.", presentacion: "" },
      { nombre: "PlayStation Plus Premium 12 meses", categoria: "Membresías", precio: 303.99, imagen: "/ps-plus.jpg", stock: 0, descripcion: "Disfruta de juegos mensuales, acceso anticipado y modo multijugador online.", presentacion: "" },
      { nombre: "Xbox Game Pass Ultimate", categoria: "Membresías", precio: 227.99, imagen: "/game-pass.jpg", stock: 0, descripcion: "Más de 100 juegos para consola y PC con acceso a estrenos desde el día uno.", presentacion: "" },
      { nombre: "Polera Zelda Trifuerza", categoria: "Merch", precio: 133.99, imagen: "/polera-zelda.jpg", stock: 0, descripcion: "Polera de algodón premium con diseño de la Trifuerza dorada de Zelda.", presentacion: "" },
      { nombre: "Gorra Super Mario", categoria: "Merch", precio: 94.99, imagen: "/gorra-mario.jpg", stock: 0, descripcion: "Gorra roja con la clásica ‘M’ bordada, ideal para cualquier fan de Mario.", presentacion: "" },
      { nombre: "Mochila Pokémon Pikachu", categoria: "Merch", precio: 189.99, imagen: "/mochila-pokemon.jpg", stock: 0, descripcion: "Mochila espaciosa con estampado de Pikachu, perfecta para uso diario o escolar.", presentacion: "" },
      { nombre: "Tarjeta Gráfica RTX 4070", categoria: "Componentes PC", precio: 3039.99, imagen: "/rtx4070.jpg", stock: 0, descripcion: "GPU de última generación con trazado de rayos y rendimiento superior en 1440p.", presentacion: "" },
      { nombre: "Procesador Intel Core i7 13700K", categoria: "Componentes PC", precio: 1633.99, imagen: "/intel-i7.jpg", stock: 0, descripcion: "Procesador de alto rendimiento ideal para gaming y multitareas intensivas.", presentacion: "" },
      { nombre: "SSD NVMe 2TB Samsung 980 Pro", categoria: "Componentes PC", precio: 873.99, imagen: "/ssd-980pro.jpg", stock: 0, descripcion: "Unidad de estado sólido ultrarrápida para mejorar tiempos de carga y rendimiento.", presentacion: "" },
      { nombre: "LEGO Super Mario Starter Pack", categoria: "Juguetes", precio: 265.99, imagen: "/lego-mario.jpg", stock: 0, descripcion: "Set interactivo de LEGO con figuras de Mario y niveles personalizables.", presentacion: "" },
      { nombre: "Figura articulada Sonic", categoria: "Juguetes", precio: 94.99, imagen: "/sonic-figure.jpg", stock: 0, descripcion: "Figura articulada de Sonic con detalles fieles al personaje original.", presentacion: "" },
      { nombre: "Pelota Pokéball oficial", categoria: "Juguetes", precio: 56.99, imagen: "/pokeball.jpg", stock: 0, descripcion: "Pelota coleccionable de alta calidad inspirada en la clásica Pokéball.", presentacion: "" }
    ];

    const productos = [];
    for (const p of productosLista) {
      const created = await Producto.create(p);
      productos.push(created);
    }
    console.log('✅ Productos creados (lista extendida)');

    // Crear orden para Andrea (admin)
    const orden1 = await Orden.create({
      usuarioId: usuarios[0].id,
      estado: 'pendiente',
      total: 0
    });

    await Promise.all([
      OrdenProducto.create({
        ordenId: orden1.id,
        productoId: productos[0].id,
        cantidad: 2,
        precioUnitario: 1500.0
      }),
      OrdenProducto.create({
        ordenId: orden1.id,
        productoId: productos[1].id,
        cantidad: 1,
        precioUnitario: 80.0
      })
    ]);

    let total1 = 2 * 1500 + 1 * 80;
    orden1.total = total1;
    await orden1.save();


    // Crear orden para Luis (usuario activo)
    const orden2 = await Orden.create({
      usuarioId: usuarios[1].id,
      estado: 'pagado',
      total: 0
    });

    await OrdenProducto.create({
      ordenId: orden2.id,
      productoId: productos[2].id,
      cantidad: 1,
      precioUnitario: 600.0
    });
    let total2 = 1 * 600;
    orden2.total = total2;
    await orden2.save();


    console.log('✅ Órdenes creadas y productos asociados');
    console.log('✅ Seed finalizado con éxito');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en recreate_and_seed:', err);
    process.exit(1);
  }
}

run();
