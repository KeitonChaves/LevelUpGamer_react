//import { useState } from "react";
// import FooterComponent from "../components/FooterComponent";
// import ProductCard from "../components/tarjetaProductos";
// import Cart from "../components/Carrito";
// import SearchBar from "../components/BarraBusquedaProductos";
// import productosData from "../data/productos.json";

// // Importa imágenes
// import kumara from "../assets/img/productos/kumara.png";
// import logitech from "../assets/img/productos/logitech.jpg";
// import razer from "../assets/img/productos/razer-firefly-V2-Pro-mousepad.jpg";
// import kingston from "../assets/img/productos/fury_ram.jpg";
// import victus from "../assets/img/productos/victus.jpg";
// import tuf16 from "../assets/img/productos/tuf.png";
// import predator from "../assets/img/productos/predator.jpg";
// import katana17 from "../assets/img/productos/katana17.png";
// import uno from "../assets/img/productos/uno.jpg";
// import silla1 from "../assets/img/productos/silla1.jpg";
// import silla2 from "../assets/img/productos/silla2.jpg";
// import silla3 from "../assets/img/productos/silla3.png";
// import silla4 from "../assets/img/productos/silla4.jpg";
// import nintendosw2 from "../assets/img/productos/nintendosw2.jpg";
// import ps5 from "../assets/img/productos/ps5.jpg";
// import rogally from "../assets/img/productos/rogally.jpg";
// import xboxseriesx from "../assets/img/productos/xboxseriesx.png";
// import monopoly from "../assets/img/productos/monopoly.jpg";
// import preguntados from "../assets/img/productos/preguntados.jpg";
// import clue from "../assets/img/productos/clue.jpg";

// // Mapea nombres del JSON a imágenes reales
// const imagenes = {
//   "kumara.png": kumara,
//   "logitech.jpg": logitech,
//   "razer-firefly-V2-Pro-mousepad.jpg": razer,
//   "fury_ram.jpg": kingston,
//   "victus.jpg": victus,
//   "tuf.png": tuf16,
//   "predator.jpg": predator,
//   "katana17.png": katana17,
//   "uno.jpg": uno,
//   "silla1.jpg": silla1,
//   "silla2.jpg": silla2,
//   "silla3.png": silla3,
//   "silla4.jpg": silla4,
//   "nintendosw2.jpg": nintendosw2,
//   "ps5.jpg": ps5,
//   "rogally.jpg": rogally,
//   "xboxseriesx.png": xboxseriesx,
//   "monopoly.jpg": monopoly,
//   "preguntados.jpg": preguntados,
//   "clue.jpg": clue,
// };

// export default function Productos() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearchChange = (e) => setSearchTerm(e.target.value);

//   // Asigna imagen real a cada producto
//   const productos = productosData.map((p) => ({
//     ...p,
//     imagen: imagenes[p.imagen] || "",
//   }));

//   // Filtra productos según búsqueda
//   const filteredProducts = productos.filter((p) => {
//     const nombre = p.nombre?.toLowerCase() || "";
//     const descripcion = p.descripcion?.toLowerCase() || "";
//     const codigo = p.codigo?.toLowerCase() || "";

//     return (
//       nombre.includes(searchTerm.toLowerCase()) ||
//       descripcion.includes(searchTerm.toLowerCase()) ||
//       codigo.includes(searchTerm.toLowerCase())
//     );
//   });

//   // Carrito
//   const [carrito, setCarrito] = useState(() => {
//     const guardado = localStorage.getItem("carrito");
//     return guardado ? JSON.parse(guardado) : [];
//   });

//   const agregarAlCarrito = (producto) => {
//     const existe = carrito.find((item) => item.id === producto.id);
//     const nuevo = existe
//       ? carrito.map((i) =>
//           i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
//         )
//       : [...carrito, { ...producto, cantidad: 1 }];

//     setCarrito(nuevo);
//     localStorage.setItem("carrito", JSON.stringify(nuevo));
//   };

//   const eliminarDelCarrito = (id) => {
//     const nuevo = carrito.filter((item) => item.id !== id);
//     setCarrito(nuevo);
//     localStorage.setItem("carrito", JSON.stringify(nuevo));
//   };

//   // Calcula total y descuento DUOCUC correctamente
//   const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

//   // Leer usuario del localStorage y obtener correo de forma segura
//   const storedUser = localStorage.getItem("user");
//   const correo = storedUser ? JSON.parse(storedUser).email || "" : "";
//   const descuento = correo.toLowerCase().endsWith("@duocuc.cl") ? 0.2 : 0;

//   const totalConDescuento = total - total * descuento;

//   return (
//     <>
//       <div className="container my-5">
//         <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

//         <h1 className="mb-4">Nuestros Productos</h1>

//         <div className="row">
//           {filteredProducts.length > 0 ? (
//             filteredProducts.map((producto) => (
//               <ProductCard
//                 key={producto.id}
//                 producto={producto}
//                 agregarAlCarrito={agregarAlCarrito}
//               />
//             ))
//           ) : (
//             <p>No se encontraron productos.</p>
//           )}
//         </div>

//         <Cart
//           carrito={carrito}
//           eliminarDelCarrito={eliminarDelCarrito}
//           total={total}
//           descuento={descuento}
//           totalConDescuento={totalConDescuento}
//           setCarrito={setCarrito}
//         />
//       </div>

//       <FooterComponent />
//     </>
//   );
// }
import { useState, useEffect } from "react";
import axios from "axios";
import FooterComponent from "../components/FooterComponent";
import ProductCard from "../components/tarjetaProductos";
import Cart from "../components/Carrito";
import SearchBar from "../components/BarraBusquedaProductos";

export default function Productos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carrito");
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const respuesta = await axios.get(
          "/api/productos/disponibles",
          {
            headers: { "x-api-key": "lvlupgamer1306" },
          }
        );

        // Asignar URL dinámica de imagen para cada producto
        const productosConImagen = respuesta.data.data.map((p) => ({
          ...p,
          imagen: `/api/productos/imagen/${p.idProducto}`,
        }));

        setProductos(productosConImagen);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProductos();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredProducts = productos.filter((p) => {
    const nombre = p.nombre?.toLowerCase() || "";
    const descripcion = p.descripcion?.toLowerCase() || "";
    const codigo = p.codigo?.toLowerCase() || "";

    return (
      nombre.includes(searchTerm.toLowerCase()) ||
      descripcion.includes(searchTerm.toLowerCase()) ||
      codigo.includes(searchTerm.toLowerCase())
    );
  });

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find((item) => item.id === producto.id);
    const nuevo = existe
      ? carrito.map((i) =>
          i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      : [...carrito, { ...producto, cantidad: 1 }];

    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  const eliminarDelCarrito = (id) => {
    const nuevo = carrito.filter((item) => item.id !== id);
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const storedUser = localStorage.getItem("user");
  const correo = storedUser ? JSON.parse(storedUser).email || "" : "";
  const descuento = correo.toLowerCase().endsWith("@duocuc.cl") ? 0.2 : 0;

  const totalConDescuento = total - total * descuento;

  return (
    <>
      <div className="container my-5">
        <SearchBar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

        <h1 className="mb-4">Nuestros Productos</h1>

        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((producto) => (
              <ProductCard
                key={producto.idProducto}
                producto={producto}
                agregarAlCarrito={agregarAlCarrito}
              />
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>

        <Cart
          carrito={carrito}
          eliminarDelCarrito={eliminarDelCarrito}
          total={total}
          descuento={descuento}
          totalConDescuento={totalConDescuento}
          setCarrito={setCarrito}
        />
      </div>

      <FooterComponent />
    </>
  );
}
