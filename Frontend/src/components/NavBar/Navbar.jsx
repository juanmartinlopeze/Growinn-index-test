import logoInnlab from "../../../public/Innlab.png";
import "./Navbar.css";
export function NavBar() {
    return (
        <nav className="navbar">
            <div className="LogoContainer">
                <a href="#Incio" className="logo-link">
                    <img src={logoInnlab} alt="Logo innlab" className="logo" />
                </a>
            </div>
            <div className="navbar-content">
                <div className="NavLinksContainer">
                    <ul className="nav-links">
                        <li><a href="#Inicio">Inicio</a></li>
                        <li><a href="#Servicios">Servicios</a></li>
                        <li><a href="#Casos de exito">Casos de exito</a></li>
                        <li><a href="#Quienes somos">Quienes somos</a></li>
                        <li><a href="#Recursos">Recursos</a></li>
                        <li><a href="#Contact">Contacto</a></li>
                    </ul>
                </div>
            </div>
            <div className="nav-login">
                <ul>
                    <li><a href="#Ingresar">Ingresar</a></li>
                </ul>
            </div>
        </nav>
    );
}
