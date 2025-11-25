export const IMAGES = {
  backgrounds: {
    hero: '/images/backgrounds/hero-background.png'
  },
  decorative: {
    lineOrange: '/images/decorative/line-orange.png',
    linePurple: '/images/decorative/line-purple.png',
    lineGreen: '/images/decorative/line-green.png',
    orangeRectangle: '/images/decorative/orange-rectangle.png',
    purpleRectangle: '/images/decorative/purple-rectangle.png',
    greenRectangle: '/images/decorative/green-rectangle.png'
  },
  mockups: {
    pcMockup: '/images/mockups/mockup-pc-1.png',
    toolPreview: '/images/mockups/tool-preview.png'
  },
  brands: {
    affiliateBrands: '/images/brands/affiliate-brands.png'
  }
};

export const ICONS = {
  // Footer/Social icons
  arrowRight: '/icons/button-icons-right.svg',
  facebook: '/icons/facebook.svg',
  instagram: '/icons/instagram.svg',
  linkedin: '/icons/linkedin.svg',
  logo: '/icons/logo.svg',
  whatsapp: '/icons/whatsapp.svg',
  youtube: '/icons/youtube.svg',
  // Etapas icons (also available as React components via import)
  etapasAnalisis: '/icons/etapas-analisis.svg',
  etapasAreas: '/icons/etapas-areas.svg',
  etapasJerarquias: '/icons/etapas-jerarquias-cargos.svg',
  etapasRegistro: '/icons/etapas-registro.svg',
  etapasTabla: '/icons/etapas-tabla.svg',
  etapasValidacion: '/icons/etapas-validacion.svg'
};

// Carousel configurations
import carrouselImage1 from '../assets/images/carrousels/carrouselej1.jpg'
import carrouselImage2 from '../assets/images/carrousels/carrouselej2.jpg'

export const CAROUSEL_SLIDES = {
  dashboard: [
    { id: 1, image: carrouselImage1 },
    { id: 2, image: carrouselImage2 },
  ],
  report: [
    { id: 1, image: carrouselImage2 },
    { id: 2, image: carrouselImage1 },
  ],
  inndex: [
    { id: 1, image: carrouselImage2 },
    { id: 2, image: carrouselImage1 },
  ],

};
