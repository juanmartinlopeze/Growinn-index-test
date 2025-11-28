import React from 'react'
import { Link } from 'react-router-dom'
import { ICONS } from '../constants/assetPaths'

export const Footer = () => {
	const socialMediaLinks = [
		{ id: 1, icon: ICONS.facebook, label: 'Facebook', href: '#' },
		{ id: 2, icon: ICONS.instagram, label: 'Instagram', href: '#' },
		{ id: 3, icon: ICONS.whatsapp, label: 'Whatsapp', href: '#' },
		{ id: 4, icon: ICONS.linkedin, label: 'Linkedin', href: '#' },
		{ id: 5, icon: ICONS.youtube, label: 'Youtube', href: '#' },
	]

	const footerLinks = [
		{ id: 1, text: 'Política de privacidad', href: '#' },
		{ id: 2, text: 'Términos y condiciones', href: '#' },
		{ id: 3, text: 'Política de Cookies', href: '#' },
		{ id: 4, text: 'Contáctanos', href: '#' },
	]

	return (
		<footer className='w-full bg-[#E9683B] min-h-[450px] pt-14'>
			{/* centered container */}
			<div className='mx-auto max-w-[1314px] w-full px-6 py-10 md:py-16 flex flex-col gap-8 justify-center'>
				{/* top row: headline + CTA + logo (stacks on small screens) */}
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-12'>
					<div className='flex flex-col gap-10'>
						<h2 className='text-white text-lg font-regular text-left'>Transforma tu empresa con INNLAB</h2>

						<Link
							to='/home'
							className='inline-flex items-center justify-center w-max gap-3 bg-white rounded-full px-5 py-2 text-sm hover:scale-105 transition-transform duration-200'
							aria-label='Descubrir cómo transformar tu empresa'
						>
							<span className='text-[#333333] text-sm'>Quiero descubrir cómo</span>

							<div className='inline-flex items-center bg-black rounded-full p-2'>
								<img src={ICONS.arrowRight} className='w-5 h-5' alt='arrow' />
							</div>
						</Link>
					</div>

					{/* logo aligned to the right on md+ */}
					<img className='h-10 self-start md:self-center' alt='INNLAB Universidad Icesi' src={ICONS.logo} />
				</div>

				{/* divider */}
				<hr className='border-white/20 my-8' />

				{/* bottom row: social + copyright + legal links */}
				<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
					{/* social */}
					<div className='flex items-center gap-4'>
						<span className='text-white opacity-90'>Síguenos</span>

						<nav className='flex items-center gap-3' aria-label='Redes sociales'>
							{socialMediaLinks.map(({ id, label, href, icon }) => (
								<a key={id} href={href} aria-label={label} className='hover:opacity-80 transition-opacity'>
									<img src={icon} alt={label} className='w-5 h-5' />
								</a>
							))}
						</nav>
					</div>

					{/* copyright + legal links */}
					<div className='flex flex-col md:flex-row md:items-center md:gap-8 gap-4 w-full md:w-auto justify-between'>
						<p className='text-white text-sm'>Copyright © 2024 INNLAB y Universidad Icesi</p>

						<nav className='flex flex-wrap items-center gap-6' aria-label='Enlaces legales'>
							{footerLinks.map(({ id, text, href }) => (
								<a key={id} href={href} className='text-white text-sm hover:opacity-80 transition-opacity'>
									{text}
								</a>
							))}
						</nav>
					</div>
				</div>
			</div>
		</footer>
	)
}
