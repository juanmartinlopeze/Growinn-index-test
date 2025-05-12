import logoInnlab from '../../../public/Innlab.png'
import './Navbar.css'
export function NavBar() {
	return (
		<nav className='navbar'>
			<div className='LogoContainer'>
				<a href='#Incio' className='logo-link'>
					<img src={logoInnlab} alt='Logo innlab' className='logo' />
				</a>
			</div>

			<ul className='nav-links'>
				<li>
					<a href='#Inicio'>Inicio</a>
				</li>
				<li>
					<a href='#Servicios'>Servicios</a>
					{
						<svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
							<path d='M11.7938 9.5188L8 13.3125L4.20625 9.5188' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round' />
							<path d='M8 2.6875L8 13.2062' stroke-miterlimit='10' stroke-linecap='round' stroke-linejoin='round' />
						</svg>
					}
				</li>
				<li>
					<a href='#Casos de exito'>Casos de exito</a>
				</li>
				<li>
					<a href='#Quienes somos'>Quienes somos</a>
				</li>
				<li>
					<a href='#Recursos'>Recursos</a>
				</li>
				<li>
					<a href='#Contact'>Contacto</a>
				</li>
			</ul>

			<div className='nav-login'>
				<ul>
					<li>
						<a href='#Ingresar'>Ingresar</a>
					</li>
				</ul>
			</div>
		</nav>
	)
}
