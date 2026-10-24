/**
 * WimBelemDon - Banco de Dados Dinâmico e Parâmetros (Anti-Hardcoding)
 * Sociedade WimBelemDon - Educando com o Tênis
 * Av. Heitor Viêira, 68 - Belém Novo, Porto Alegre - RS
 */

export const WBD_DATA = {
  institution: {
    name: "Sociedade WimBelemDon",
    shortName: "WimBelemDon",
    tagline: "Educando com o Tênis • Transformação Social",
    foundedYear: 2000,
    address: {
      street: "Av. Heitor Viêira, 68",
      neighborhood: "Belém Novo",
      city: "Porto Alegre",
      state: "RS",
      zip: "91780-000",
      phone: "(51) 3242-5637",
      email: "contato@wimbelemdon.com.br",
      lat: -30.198334,
      lng: -51.178889,
      mapsUrl: "https://maps.google.com/?q=Av.+Heitor+Vieira,+68+-+Bel%C3%A9m+Novo,+Porto+Alegre+-+RS"
    },
    metrics: {
      studentsServed: 90,
      maximumCapacity: 100,
      yearsOfHistory: 26, // Desde 2000
      hoursCognitiveDevelopment: "1.200h+/ano"
    },
    mission: "Promover a inclusão de crianças e adolescentes em situação de vulnerabilidade social em Belém Novo, fomentando o desenvolvimento integral através do tênis, cultura e apoio pedagógico.",
    ambassadors: [
      { name: "Fernando Meligeni", role: "Embaixador e Ex-tenista Top 25 ATP", quote: "É muito mais do que tênis. É acolhimento, alimentação e valores para a vida inteira." },
      { name: "Thomaz Koch", role: "Lenda do tênis brasileiro", quote: "O esporte é um instrumento que dá condições para essas crianças serem protagonistas." },
      { name: "Bruno Soares", role: "Campeão de Grand Slam", quote: "A seriedade e a paixão que vejo no WimBelemDon transformam realidades." },
      { name: "Chef Lucas Corazza", role: "Chef Pâtissier e Ativista Social", quote: "Quando conhecemos a seriedade desse trabalho em Belém Novo, nos apaixonamos." }
    ]
  },

  news: [
    {
      id: "news-1",
      title: "Contar histórias com o audiovisual",
      date: "Março 2026",
      category: "Cultura & Educação",
      summary: "Educandos do WimBelemDon produzem curtas-metragens documentando os saberes e as memórias da comunidade de Belém Novo.",
      readTime: "3 min"
    },
    {
      id: "news-2",
      title: "Clube de Literatura Fantástica",
      date: "Fevereiro 2026",
      category: "Oficinas Criativas",
      summary: "A Biblioteca Comunitária Sabiá do Saibro Sábio amplia o incentivo à leitura com ciclos mensais de narrativas fantásticas.",
      readTime: "4 min"
    },
    {
      id: "news-3",
      title: "Torneio Integração de Saibro",
      date: "Janeiro 2026",
      category: "Esporte & Valores",
      summary: "Crianças e voluntários vivenciam o espírito de respeito, disciplina e companheirismo nas quadras da sede.",
      readTime: "2 min"
    }
  ],

  plans: [
    {
      id: "plano-amigo",
      name: "Plano Amigo",
      monthlyFee: 29.90,
      highlightBadge: "Apoio Essencial",
      discountRange: "Até 5% de desconto",
      description: "Acesso a todos os estabelecimentos parceiros com desconto inicial.",
      redemptionsPerPartner: 1,
      color: "brand-teal",
      quotaRule: "1 resgate por estabelecimento a cada mês"
    },
    {
      id: "plano-transformador",
      name: "Plano Transformador",
      monthlyFee: 49.90,
      isRecommended: true,
      highlightBadge: "Mais Popular • Recomendado",
      discountRange: "De 5% a 10% de desconto",
      description: "Descontos ampliados em todos os estabelecimentos conveniados no RS.",
      redemptionsPerPartner: 1,
      color: "brand-lime",
      quotaRule: "1 resgate por estabelecimento a cada mês"
    },
    {
      id: "plano-padrinho",
      name: "Plano Padrinho Campeão",
      monthlyFee: 89.90,
      highlightBadge: "Máximo Benefício",
      discountRange: "De 10% a 15% de desconto",
      description: "Porcentagens máximas e dobro de resgates em parceiros selecionados.",
      redemptionsPerPartner: 1,
      allowDoubleRedemptionPartners: ["parque-esportivo-pucrs", "cantina-do-belem", "smash-beach-tennis"],
      color: "brand-teal-dark",
      quotaRule: "Até 2 resgates/mês em parceiros selecionados (demais 1 resgate)"
    }
  ],

  singleDonation: {
    id: "doacao-unica",
    name: "Doação Avulsa",
    presetAmounts: [5, 10, 20, 50],
    defaultAmount: 20,
    description: "Contribua com a Sociedade WimBelemDon para apoiar as atividades das crianças e jovens em Belém Novo.",
    benefits: [
      "Sem recorrência mensal no cartão ou Pix",
      "Qualquer valor financeiro contribui diretamente com a ONG",
      "Ajuda imediata para oficinas de tênis e educação"
    ]
  },

  categories: [
    { id: "all", label: "Todos", icon: "layout-grid" },
    { id: "esporte", label: "Esporte & Lazer", icon: "dumbbell" },
    { id: "gastronomia", label: "Gastronomia", icon: "utensils" },
    { id: "saude", label: "Saúde & Farmácia", icon: "heart-pulse" },
    { id: "comercio", label: "Comércio & Casa", icon: "shopping-bag" }
  ],

  partners: [
    {
      id: "parque-esportivo-pucrs",
      name: "Parque Esportivo PUCRS",
      category: "esporte",
      location: "Porto Alegre - RS",
      logoText: "PUCRS",
      tagline: "Locação de quadras poliesportivas, tênis e natação",
      discounts: {
        "plano-amigo": "5% OFF",
        "plano-transformador": "10% OFF",
        "plano-padrinho": "15% OFF",
        "doacao-unica": "5% OFF"
      },
      discountPercent: {
        "plano-amigo": 5,
        "plano-transformador": 10,
        "plano-padrinho": 15,
        "doacao-unica": 5
      },
      supportsDoubleInTopPlan: true,
      description: "Válido para locação de quadras e passes diários de musculação/natação no complexo esportivo da PUCRS."
    },
    {
      id: "decathlon",
      name: "Decathlon",
      category: "esporte",
      location: "Porto Alegre / RS",
      logoText: "DECATHLON",
      tagline: "Artigos e equipamentos esportivos de todas as modalidades",
      discounts: {
        "plano-amigo": "5% OFF",
        "plano-transformador": "8% OFF",
        "plano-padrinho": "12% OFF",
        "doacao-unica": "5% OFF"
      },
      discountPercent: {
        "plano-amigo": 5,
        "plano-transformador": 8,
        "plano-padrinho": 12,
        "doacao-unica": 5
      },
      supportsDoubleInTopPlan: false,
      description: "Desconto aplicável em vestuário, calçados e equipamentos de tênis e esportes de raquete."
    },
    {
      id: "panvel",
      name: "Panvel Farmácias",
      category: "saude",
      location: "Todo o Estado do RS",
      logoText: "PANVEL",
      tagline: "Medicamentos, dermocosméticos e cuidados pessoais",
      discounts: {
        "plano-amigo": "5% OFF",
        "plano-transformador": "10% OFF",
        "plano-padrinho": "15% OFF",
        "doacao-unica": "5% OFF"
      },
      discountPercent: {
        "plano-amigo": 5,
        "plano-transformador": 10,
        "plano-padrinho": 15,
        "doacao-unica": 5
      },
      supportsDoubleInTopPlan: false,
      description: "Desconto em itens de higiene, beleza, dermocosméticos e marcas próprias Panvel."
    },
    {
      id: "outback",
      name: "Outback Steakhouse",
      category: "gastronomia",
      location: "Shoppings de Porto Alegre",
      logoText: "OUTBACK",
      tagline: "Culinária australiana com cortes nobres e aperitivos",
      discounts: {
        "plano-amigo": "5% OFF",
        "plano-transformador": "10% OFF",
        "plano-padrinho": "12% OFF",
        "doacao-unica": "5% OFF"
      },
      discountPercent: {
        "plano-amigo": 5,
        "plano-transformador": 10,
        "plano-padrinho": 12,
        "doacao-unica": 5
      },
      supportsDoubleInTopPlan: false,
      description: "Desconto na conta total em consumações presenciais de segunda a sexta-feira."
    },
    {
      id: "lojas-quero-quero",
      name: "Lojas Quero-Quero",
      category: "comercio",
      location: "Rede em todo o RS",
      logoText: "QUERO-QUERO",
      tagline: "Materiais de construção, eletros e utilidades para o lar",
      discounts: {
        "plano-amigo": "5% OFF",
        "plano-transformador": "7% OFF",
        "plano-padrinho": "10% OFF",
        "doacao-unica": "5% OFF"
      },
      discountPercent: {
        "plano-amigo": 5,
        "plano-transformador": 7,
        "plano-padrinho": 10,
        "doacao-unica": 5
      },
      supportsDoubleInTopPlan: false,
      description: "Desconto em ferramentas, tintas e utilidades nas compras à vista ou cartão."
    },
    {
      id: "cantina-do-belem",
      name: "Cantina do Belém",
      category: "gastronomia",
      location: "Belém Novo - Porto Alegre",
      logoText: "CANTINA",
      tagline: "Massas artesanais e gastronomia típica na zona sul",
      discounts: {
        "plano-amigo": "5% OFF",
        "plano-transformador": "10% OFF",
        "plano-padrinho": "15% OFF",
        "doacao-unica": "5% OFF"
      },
      discountPercent: {
        "plano-amigo": 5,
        "plano-transformador": 10,
        "plano-padrinho": 15,
        "doacao-unica": 5
      },
      supportsDoubleInTopPlan: true,
      description: "Desconto em almoços aos sábados e domingos para apoiadores da Sociedade WimBelemDon."
    },
    {
      id: "smash-beach-tennis",
      name: "Smash Tennis & Beach Club",
      category: "esporte",
      location: "Zona Sul - Porto Alegre",
      logoText: "SMASH",
      tagline: "Quadras cobertas de tênis de saibro e arenas de beach tennis",
      discounts: {
        "plano-amigo": "5% OFF",
        "plano-transformador": "10% OFF",
        "plano-padrinho": "15% OFF",
        "doacao-unica": "5% OFF"
      },
      discountPercent: {
        "plano-amigo": 5,
        "plano-transformador": 10,
        "plano-padrinho": 15,
        "doacao-unica": 5
      },
      supportsDoubleInTopPlan: true,
      description: "Desconto na locação horária de quadras e day-use para partidas de saibro."
    },
    {
      id: "fisioterapia-pilates-sul",
      name: "Clínica Movimento & Fisioterapia",
      category: "saude",
      location: "Ipanema / Belém Novo - POA",
      logoText: "MOVIMENTO",
      tagline: "Reabilitação esportiva, fisioterapia e estúdio de pilates",
      discounts: {
        "plano-amigo": "5% OFF",
        "plano-transformador": "10% OFF",
        "plano-padrinho": "15% OFF",
        "doacao-unica": "5% OFF"
      },
      discountPercent: {
        "plano-amigo": 5,
        "plano-transformador": 10,
        "plano-padrinho": 15,
        "doacao-unica": 5
      },
      supportsDoubleInTopPlan: false,
      description: "Válido para avaliações posturais e pacotes mensais de pilates e fisioterapia preventiva."
    }
  ]
};
