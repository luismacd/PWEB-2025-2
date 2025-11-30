export const products = [
  { id: 'p1', nombre: 'Auriculares Gamer', precio: 79.99, categoria: 'Audio', imagen: '/img/auriculares.jpg', ventas: 120, activo:true },
  { id: 'p2', nombre: 'Mouse Inalámbrico', precio: 29.9, categoria: 'Periféricos', imagen: '/img/mouse.jpg', ventas: 90, activo:true },
  { id: 'p3', nombre: 'Teclado Mecánico', precio: 119.5, categoria: 'Periféricos', imagen: '/img/teclado.jpg', ventas: 70, activo:true },
  { id: 'p4', nombre: 'Monitor 24"', precio: 179.99, categoria: 'Monitores', imagen: '/img/monitor.jpg', ventas: 55, activo:true },
  { id: 'p5', nombre: 'Webcam HD', precio: 49.99, categoria: 'Video', imagen: '/img/webcam.jpg', ventas: 40, activo:true }
]

export const users = [
  { id: 'u1', nombre: 'Alumno', apellido: 'Uno', email: 'alumno1@example.com', role: 'user', activo:true },
  { id: 'u2', nombre: 'Admin', apellido: 'Root', email: 'admin@example.com', role: 'admin', activo:true }
]

export const orders = [
  { id: 'o1', usuarioId: 'u1', total: 109.9, estado: 'Completado', items: [{productId:'p2', cantidad:2}], fecha: '2025-11-01' }
]
