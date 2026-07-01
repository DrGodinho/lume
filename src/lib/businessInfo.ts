export const businessInfo = {
  name: 'LUME Controle Solar',
  siteUrl: 'https://lumecontrolesolar.com.br',
  phoneE164: '+5521965140612',
  phoneDisplay: '(21) 96514-0612',
  whatsappUrl: 'https://wa.me/5521965140612',
  email: 'drgodinho@gmail.com',
  address: {
    streetAddress: 'Estrada do Realengo, 973',
    addressLocality: 'Rio de Janeiro',
    addressRegion: 'RJ',
    postalCode: '21715-331',
    addressCountry: 'BR',
    display: 'Estrada do Realengo, 973 - Rio de Janeiro, RJ, 21715-331',
    mapsQuery: 'Estrada do Realengo, 973, Rio de Janeiro, RJ, 21715-331',
  },
  socialProfiles: {
    instagram: 'https://www.instagram.com/lumecontrolesolar',
    facebook: 'https://www.facebook.com/lumecontrolesolar',
  },
} as const;

export const businessAddressSchema = {
  '@type': 'PostalAddress',
  streetAddress: businessInfo.address.streetAddress,
  addressLocality: businessInfo.address.addressLocality,
  addressRegion: businessInfo.address.addressRegion,
  postalCode: businessInfo.address.postalCode,
  addressCountry: businessInfo.address.addressCountry,
} as const;

export const businessSameAs = [
  businessInfo.socialProfiles.instagram,
  businessInfo.socialProfiles.facebook,
] as const;
