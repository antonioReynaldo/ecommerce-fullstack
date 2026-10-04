import { prisma } from '../src/lib/prisma.js';
import peruUbigeo from './data/peru-ubigeo.json';

async function seedUbigeo() {
  // 1. Departamentos
  await prisma.department.createMany({
    data: peruUbigeo.departments.map((d) => ({
      id: d.id,
      name: d.name,
      ubigeoCode: d.ubigeoCode
    })),
    skipDuplicates: true
  });

  // 2. Provincias (dependen de department_id)
  await prisma.province.createMany({
    data: peruUbigeo.provinces.map((p) => ({
      id: p.id,
      name: p.name,
      ubigeoCode: p.ubigeoCode,
      departmentId: p.departmentId
    })),
    skipDuplicates: true
  });

  // 3. Distritos (dependen de province_id)
  await prisma.district.createMany({
    data: peruUbigeo.districts.map((dist) => ({
      id: dist.id,
      name: dist.name,
      ubigeoCode: dist.ubigeoCode,
      provinceId: dist.provinceId
    })),
    skipDuplicates: true
  });
}

async function seedPositions() {
  await prisma.position.createMany({
    data: [
      { name: 'Cajero' },
      { name: 'Vendedor' },
      { name: 'Almacenero' },
      { name: 'Reponedor' },
      { name: 'Recursos Humanos' },
      { name: 'Contador' }
    ],
    skipDuplicates: true
  });
}

async function main() {
  await prisma.role.createMany({
    data: [{ name: 'admin' }, { name: 'employee' }, { name: 'customer' }],
    skipDuplicates: true
  });

  await seedUbigeo();
  await seedPositions();

  // usuario admin
  await prisma.user.create({
    data: {
      name: 'Elias Paredes Torres',
      email: 'admin@test.com',
      passwordHash: '$2b$12$bCMLW4eEJjJ6vO4cq6Ss1.SjAzRqNWDVEk2bFnCh0eb5fpm5YaUhe',
      roleId: 1,
      authProvider: 'local'
    }
  });

  // ==========================================================
  // 1. HERRAMIENTAS
  // ==========================================================
  const herramientas = await prisma.category.create({
    data: {
      name: 'Herramientas',
      description:
        'Todo lo que necesitas para reparar, armar y construir en casa o el taller: herramientas manuales y eléctricas de calidad profesional.',
      parentId: null
    }
  });

  const herramientasManuales = await prisma.category.create({
    data: {
      name: 'Herramientas Manuales',
      description: 'Herramientas de uso manual para trabajos de ajuste, corte y armado en el hogar o taller.',
      parentId: herramientas.id
    }
  });

  const screwdrivers = await prisma.category.create({
    data: {
      name: 'Destornilladores',
      description: 'Herramientas para ajustar y aflojar tornillos de distintos tipos de cabeza.',
      parentId: herramientasManuales.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Destornillador plano', description: 'Punta plana para tornillos ranurados.', parentId: screwdrivers.id },
      { name: 'Destornillador estrella (Phillips)', description: 'Punta en cruz para tornillos Phillips.', parentId: screwdrivers.id },
      { name: 'Destornillador de precisión', description: 'Juegos pequeños para electrónica y equipos delicados.', parentId: screwdrivers.id },
      { name: 'Destornillador de trinquete', description: 'Mecanismo de carraca para atornillado rápido.', parentId: screwdrivers.id },
      { name: 'Set de destornilladores', description: 'Kits combinados con varias puntas y tamaños.', parentId: screwdrivers.id }
    ]
  });

  const pliers = await prisma.category.create({
    data: {
      name: 'Alicates',
      description: 'Herramientas de sujeción, corte y doblado de materiales.',
      parentId: herramientasManuales.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Alicate universal', description: 'Uso general para sujetar y doblar.', parentId: pliers.id },
      { name: 'Alicate de corte', description: 'Diseñado para cortar alambre y cable.', parentId: pliers.id },
      { name: 'Alicate de punta larga', description: 'Ideal para espacios reducidos y precisión.', parentId: pliers.id },
      { name: 'Alicate de presión', description: 'Sujeción firme tipo mordaza autoblocante.', parentId: pliers.id },
      { name: 'Pelacables', description: 'Retira el forro de cables eléctricos.', parentId: pliers.id }
    ]
  });

  const wrenches = await prisma.category.create({
    data: {
      name: 'Llaves',
      description: 'Herramientas para apretar y aflojar tuercas y pernos.',
      parentId: herramientasManuales.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Llave inglesa', description: 'Ajustable a distintos tamaños de tuerca.', parentId: wrenches.id },
      { name: 'Llave allen (hexagonal)', description: 'Para tornillos con cabeza hexagonal interna.', parentId: wrenches.id },
      { name: 'Llave mixta', description: 'Combina boca fija y estrella en un extremo.', parentId: wrenches.id },
      { name: 'Llave de tubo (stilson)', description: 'Para tuberías y piezas cilíndricas.', parentId: wrenches.id },
      { name: 'Juego de llaves combinadas', description: 'Set completo en distintas medidas.', parentId: wrenches.id }
    ]
  });

  const hammers = await prisma.category.create({
    data: {
      name: 'Martillos',
      description: 'Herramientas de golpe para clavar, demoler o ajustar.',
      parentId: herramientasManuales.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Martillo de uña', description: 'Clásico para clavar y extraer clavos.', parentId: hammers.id },
      { name: 'Martillo de bola', description: 'Para trabajos de metal y forja.', parentId: hammers.id },
      { name: 'Combo o mazo', description: 'Golpe de alto impacto para demolición.', parentId: hammers.id },
      { name: 'Martillo de goma', description: 'Golpe sin marcar superficies delicadas.', parentId: hammers.id }
    ]
  });

  const chiselsAndGouges = await prisma.category.create({
    data: {
      name: 'Cinceles y Formones',
      description: 'Herramientas de corte manual para madera y concreto.',
      parentId: herramientasManuales.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Cincel para concreto', description: 'Corte y desbaste de superficies duras.', parentId: chiselsAndGouges.id },
      { name: 'Formón para madera', description: 'Tallado y ajuste fino en carpintería.', parentId: chiselsAndGouges.id }
    ]
  });

  const sawsAndHacksaws = await prisma.category.create({
    data: {
      name: 'Serruchos y Seguetas',
      description: 'Herramientas manuales de corte para madera y metal.',
      parentId: herramientasManuales.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Serrucho para madera', description: 'Corte recto en tableros y maderas.', parentId: sawsAndHacksaws.id },
      { name: 'Segueta para metal', description: 'Corte de precisión en piezas metálicas.', parentId: sawsAndHacksaws.id },
      { name: 'Serrucho de costilla', description: 'Cortes finos y precisos en carpintería.', parentId: sawsAndHacksaws.id }
    ]
  });

  const herramientasElectricas = await prisma.category.create({
    data: {
      name: 'Herramientas Eléctricas',
      description: 'Herramientas motorizadas que agilizan el corte, perforado, lijado y soldado.',
      parentId: herramientas.id
    }
  });

  const drills = await prisma.category.create({
    data: {
      name: 'Taladros',
      description: 'Equipos para perforar y atornillar con potencia eléctrica.',
      parentId: herramientasElectricas.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Taladro inalámbrico', description: 'Funciona a batería, ideal para movilidad.', parentId: drills.id },
      { name: 'Taladro con cable', description: 'Potencia constante para uso intensivo.', parentId: drills.id },
      { name: 'Taladro percutor', description: 'Función de percusión para concreto y mampostería.', parentId: drills.id },
      { name: 'Atornillador eléctrico', description: 'Diseñado para atornillado rápido y preciso.', parentId: drills.id }
    ]
  });

  const grinders = await prisma.category.create({
    data: {
      name: 'Amoladoras',
      description: 'Herramientas para desbastar, cortar y pulir metal.',
      parentId: herramientasElectricas.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Amoladora angular', description: 'La más común, para corte y desbaste.', parentId: grinders.id },
      { name: 'Amoladora recta', description: 'Ideal para pulido y acabados finos.', parentId: grinders.id },
      { name: 'Mini amoladora', description: 'Compacta para trabajos de precisión.', parentId: grinders.id }
    ]
  });

  const sanders = await prisma.category.create({
    data: {
      name: 'Lijadoras',
      description: 'Equipos eléctricos para alisar superficies de madera o metal.',
      parentId: herramientasElectricas.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Lijadora orbital', description: 'Movimiento circular para acabados uniformes.', parentId: sanders.id },
      { name: 'Lijadora de banda', description: 'Alto rendimiento en superficies grandes.', parentId: sanders.id },
      { name: 'Lijadora de disco', description: 'Lijado rápido en madera y metal.', parentId: sanders.id }
    ]
  });

  const electricSaws = await prisma.category.create({
    data: {
      name: 'Sierras Eléctricas',
      description: 'Herramientas de corte motorizado para madera y otros materiales.',
      parentId: herramientasElectricas.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Sierra circular', description: 'Cortes rectos y rápidos en madera.', parentId: electricSaws.id },
      { name: 'Sierra caladora', description: 'Cortes curvos y detallados.', parentId: electricSaws.id },
      { name: 'Sierra de banco', description: 'Cortes de precisión en taller fijo.', parentId: electricSaws.id },
      { name: 'Sierra ingletadora', description: 'Cortes angulares precisos para molduras.', parentId: electricSaws.id }
    ]
  });

  const weldingEquipment = await prisma.category.create({
    data: {
      name: 'Equipos de Soldadura',
      description: 'Máquinas y accesorios para unir piezas metálicas.',
      parentId: herramientasElectricas.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Soldadora inversora', description: 'Compacta, eficiente y de fácil transporte.', parentId: weldingEquipment.id },
      { name: 'Soldadora transformador', description: 'Robusta para trabajos de mayor exigencia.', parentId: weldingEquipment.id },
      { name: 'Accesorios de soldadura', description: 'Electrodos, careta, guantes y pinzas.', parentId: weldingEquipment.id }
    ]
  });

  // ==========================================================
  // 2. ELECTRICIDAD
  // ==========================================================
  const electricidad = await prisma.category.create({
    data: {
      name: 'Electricidad',
      description: 'Materiales e insumos para instalaciones eléctricas residenciales e industriales.',
      parentId: null
    }
  });

  const cablesAndConductors = await prisma.category.create({
    data: {
      name: 'Cables y Conductores',
      description: 'Cables para transporte de energía eléctrica y datos.',
      parentId: electricidad.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Cable THW', description: 'Uso residencial en instalaciones entubadas.', parentId: cablesAndConductors.id },
      { name: 'Cable dúplex', description: 'Para conexiones de baja tensión y extensiones.', parentId: cablesAndConductors.id },
      { name: 'Cable UTP', description: 'Cableado de redes y datos.', parentId: cablesAndConductors.id },
      { name: 'Cable de extensión', description: 'Alargadores portátiles para uso doméstico.', parentId: cablesAndConductors.id }
    ]
  });

  const switchesAndOutlets = await prisma.category.create({
    data: {
      name: 'Interruptores y Tomacorrientes',
      description: 'Dispositivos para el control y conexión de energía eléctrica.',
      parentId: electricidad.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Interruptor simple', description: 'Control de un solo punto de luz.', parentId: switchesAndOutlets.id },
      { name: 'Interruptor de conmutación', description: 'Control desde dos puntos distintos.', parentId: switchesAndOutlets.id },
      { name: 'Tomacorriente simple', description: 'Conexión estándar para equipos y dispositivos.', parentId: switchesAndOutlets.id },
      { name: 'Tomacorriente doble', description: 'Dos salidas en un solo dispositivo.', parentId: switchesAndOutlets.id },
      { name: 'Dimmer', description: 'Regula la intensidad de la iluminación.', parentId: switchesAndOutlets.id }
    ]
  });

  const lighting = await prisma.category.create({
    data: {
      name: 'Iluminación',
      description: 'Productos para iluminar espacios interiores y exteriores.',
      parentId: electricidad.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Foco LED', description: 'Bajo consumo y larga duración.', parentId: lighting.id },
      { name: 'Fluorescente', description: 'Iluminación económica de alto rendimiento.', parentId: lighting.id },
      { name: 'Reflector', description: 'Iluminación de gran alcance para exteriores.', parentId: lighting.id },
      { name: 'Lámpara decorativa', description: 'Aporta estilo además de iluminación.', parentId: lighting.id }
    ]
  });

  const panelsAndProtection = await prisma.category.create({
    data: {
      name: 'Tableros y Protección',
      description: 'Elementos de seguridad y distribución eléctrica.',
      parentId: electricidad.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Tablero eléctrico', description: 'Centraliza y distribuye los circuitos.', parentId: panelsAndProtection.id },
      { name: 'Llave termomagnética', description: 'Protege contra sobrecargas y cortocircuitos.', parentId: panelsAndProtection.id },
      { name: 'Interruptor diferencial', description: 'Protección contra fugas de corriente.', parentId: panelsAndProtection.id }
    ]
  });

  const cableManagement = await prisma.category.create({
    data: {
      name: 'Canalización',
      description: 'Elementos para proteger y ordenar el cableado.',
      parentId: electricidad.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Tubo PVC eléctrico', description: 'Protección rígida para cables entubados.', parentId: cableManagement.id },
      { name: 'Canaleta', description: 'Organiza cables de forma visible y ordenada.', parentId: cableManagement.id }
    ]
  });

  // ==========================================================
  // 3. GASFITERÍA Y PLOMERÍA
  // ==========================================================
  const plumbing = await prisma.category.create({
    data: {
      name: 'Gasfitería y Plomería',
      description: 'Todo para instalaciones de agua, desagüe y sistemas de bombeo.',
      parentId: null
    }
  });

  const pipesAndFittings = await prisma.category.create({
    data: {
      name: 'Tubos y Conexiones',
      description: 'Tuberías y accesorios para conducción de agua.',
      parentId: plumbing.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Tubo PVC', description: 'Uso general en agua fría y desagüe.', parentId: pipesAndFittings.id },
      { name: 'Tubo CPVC', description: 'Resistente a altas temperaturas, agua caliente.', parentId: pipesAndFittings.id },
      { name: 'Tubo PEX', description: 'Flexible, ideal para instalaciones modernas.', parentId: pipesAndFittings.id },
      { name: 'Tubo de cobre', description: 'Alta durabilidad para gas e instalaciones especiales.', parentId: pipesAndFittings.id }
    ]
  });

  const valves = await prisma.category.create({
    data: {
      name: 'Válvulas',
      description: 'Controlan el flujo de agua en la instalación.',
      parentId: plumbing.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Válvula de bola', description: 'Apertura y cierre rápido de 1/4 de vuelta.', parentId: valves.id },
      { name: 'Válvula check', description: 'Evita el retorno del flujo de agua.', parentId: valves.id },
      { name: 'Válvula de compuerta', description: 'Control de flujo en tuberías principales.', parentId: valves.id }
    ]
  });

  const faucets = await prisma.category.create({
    data: {
      name: 'Grifería',
      description: 'Llaves y mezcladoras para cocina y baño.',
      parentId: plumbing.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Grifería para cocina', description: 'Mezcladoras y caños para el lavadero.', parentId: faucets.id },
      { name: 'Grifería para baño', description: 'Mezcladoras para lavatorio y ducha.', parentId: faucets.id },
      { name: 'Llave de paso', description: 'Corta el flujo de agua en un punto.', parentId: faucets.id }
    ]
  });

  const installationAccessories = await prisma.category.create({
    data: {
      name: 'Accesorios de Instalación',
      description: 'Complementos necesarios para el montaje de tuberías.',
      parentId: plumbing.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Cinta teflón', description: 'Sella roscas y evita fugas de agua.', parentId: installationAccessories.id },
      { name: 'Abrazadera', description: 'Sujeta y fija tuberías de forma segura.', parentId: installationAccessories.id },
      { name: 'Sello y empaque', description: 'Evita filtraciones en conexiones y llaves.', parentId: installationAccessories.id }
    ]
  });

  const waterPumps = await prisma.category.create({
    data: {
      name: 'Bombas de Agua',
      description: 'Equipos para elevar o presurizar el suministro de agua.',
      parentId: plumbing.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Bomba sumergible', description: 'Extrae agua desde pozos o cisternas.', parentId: waterPumps.id },
      { name: 'Bomba periférica', description: 'Impulsa agua en instalaciones domésticas.', parentId: waterPumps.id },
      { name: 'Bomba presurizadora', description: 'Aumenta la presión del agua en la vivienda.', parentId: waterPumps.id }
    ]
  });

  // ==========================================================
  // 4. PINTURAS Y ACABADOS
  // ==========================================================
  const paintsAndFinishes = await prisma.category.create({
    data: {
      name: 'Pinturas y Acabados',
      description: 'Pinturas, herramientas y accesorios para renovar y proteger superficies.',
      parentId: null
    }
  });

  const paints = await prisma.category.create({
    data: {
      name: 'Pinturas',
      description: 'Recubrimientos decorativos y protectores para interiores y exteriores.',
      parentId: paintsAndFinishes.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Pintura látex', description: 'Ideal para muros interiores y exteriores.', parentId: paints.id },
      { name: 'Esmalte', description: 'Acabado brillante y resistente para madera y metal.', parentId: paints.id },
      { name: 'Pintura anticorrosiva', description: 'Protege superficies metálicas de la oxidación.', parentId: paints.id },
      { name: 'Barniz', description: 'Protege y resalta el veteado de la madera.', parentId: paints.id }
    ]
  });

  const paintingTools = await prisma.category.create({
    data: {
      name: 'Herramientas para Pintar',
      description: 'Utensilios para la aplicación de pintura.',
      parentId: paintsAndFinishes.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Brocha', description: 'Aplicación manual en detalles y bordes.', parentId: paintingTools.id },
      { name: 'Rodillo', description: 'Cubre grandes superficies de forma uniforme.', parentId: paintingTools.id },
      { name: 'Pistola de pintar', description: 'Aplicación rápida y uniforme a presión.', parentId: paintingTools.id }
    ]
  });

  const paintingAccessories = await prisma.category.create({
    data: {
      name: 'Accesorios de Pintura',
      description: 'Complementos para facilitar y proteger el trabajo de pintado.',
      parentId: paintsAndFinishes.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Bandeja para pintura', description: 'Recipiente para cargar rodillos.', parentId: paintingAccessories.id },
      { name: 'Cinta de enmascarar', description: 'Protege bordes y zonas sin pintar.', parentId: paintingAccessories.id },
      { name: 'Lija', description: 'Prepara y alisa la superficie antes de pintar.', parentId: paintingAccessories.id }
    ]
  });

  const surfacePreparation = await prisma.category.create({
    data: {
      name: 'Preparación de Superficies',
      description: 'Productos previos al pintado para un mejor acabado.',
      parentId: paintsAndFinishes.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Masilla', description: 'Repara grietas e imperfecciones en la pared.', parentId: surfacePreparation.id },
      { name: 'Sellador', description: 'Uniformiza la absorción de la pintura.', parentId: surfacePreparation.id },
      { name: 'Removedor de pintura', description: 'Elimina capas de pintura antigua.', parentId: surfacePreparation.id }
    ]
  });

  // ==========================================================
  // 5. FIJACIONES Y TORNILLERÍA
  // ==========================================================
  const fastenersAndHardware = await prisma.category.create({
    data: {
      name: 'Fijaciones y Tornillería',
      description: 'Elementos de sujeción para ensamblar y fijar materiales.',
      parentId: null
    }
  });

  const screws = await prisma.category.create({
    data: {
      name: 'Tornillos',
      description: 'Elementos roscados para unir distintos materiales.',
      parentId: fastenersAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Tornillo para madera', description: 'Fijación en superficies de madera.', parentId: screws.id },
      { name: 'Tornillo para metal', description: 'Rosca fina para uniones metálicas.', parentId: screws.id },
      { name: 'Tornillo autorroscante', description: 'Perfora y rosca en un solo paso.', parentId: screws.id },
      { name: 'Tornillo drywall', description: 'Diseñado para planchas de drywall.', parentId: screws.id }
    ]
  });

  const boltsAndNuts = await prisma.category.create({
    data: {
      name: 'Pernos y Tuercas',
      description: 'Sistemas de sujeción de alta resistencia.',
      parentId: fastenersAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Perno hexagonal', description: 'Alta resistencia para estructuras y maquinaria.', parentId: boltsAndNuts.id },
      { name: 'Perno de expansión', description: 'Fijación en concreto y mampostería.', parentId: boltsAndNuts.id },
      { name: 'Tuerca hexagonal', description: 'Complemento estándar para pernos.', parentId: boltsAndNuts.id },
      { name: 'Tuerca mariposa', description: 'Ajuste manual sin herramientas.', parentId: boltsAndNuts.id }
    ]
  });

  const washers = await prisma.category.create({
    data: {
      name: 'Arandelas',
      description: 'Discos que distribuyen la presión de ajuste.',
      parentId: fastenersAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Arandela plana', description: 'Distribuye la presión en la superficie.', parentId: washers.id },
      { name: 'Arandela de presión', description: 'Evita el aflojamiento por vibración.', parentId: washers.id }
    ]
  });

  const anchors = await prisma.category.create({
    data: {
      name: 'Anclajes',
      description: 'Sistemas para fijar objetos en pared o concreto.',
      parentId: fastenersAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Tarugo plástico', description: 'Anclaje ligero para tornillos en pared.', parentId: anchors.id },
      { name: 'Tarugo metálico', description: 'Alta resistencia para cargas pesadas.', parentId: anchors.id },
      { name: 'Anclaje químico', description: 'Fijación de alta resistencia con resina.', parentId: anchors.id }
    ]
  });

  const nailsAndStaples = await prisma.category.create({
    data: {
      name: 'Clavos y Grapas',
      description: 'Elementos de fijación por impacto.',
      parentId: fastenersAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Clavo con cabeza', description: 'Uso general en madera y construcción.', parentId: nailsAndStaples.id },
      { name: 'Grapa', description: 'Fijación rápida con engrapadora.', parentId: nailsAndStaples.id }
    ]
  });

  // ==========================================================
  // 6. MATERIALES DE CONSTRUCCIÓN
  // ==========================================================
  const constructionMaterials = await prisma.category.create({
    data: {
      name: 'Materiales de Construcción',
      description: 'Insumos base para obras de construcción y remodelación.',
      parentId: null
    }
  });

  const cementAndAggregates = await prisma.category.create({
    data: {
      name: 'Cemento y Agregados',
      description: 'Materiales base para mezclas de concreto y mortero.',
      parentId: constructionMaterials.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Cemento Portland', description: 'Uso general en obras de construcción.', parentId: cementAndAggregates.id },
      { name: 'Arena', description: 'Agregado fino para mezclas y morteros.', parentId: cementAndAggregates.id },
      { name: 'Piedra chancada', description: 'Agregado grueso para concreto y bases.', parentId: cementAndAggregates.id }
    ]
  });

  const plasterAndDrywall = await prisma.category.create({
    data: {
      name: 'Yeso y Drywall',
      description: 'Sistemas ligeros para tabiquería y cielorrasos.',
      parentId: constructionMaterials.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Yeso en polvo', description: 'Para acabados y reparaciones de pared.', parentId: plasterAndDrywall.id },
      { name: 'Plancha de drywall', description: 'Tabiques y cielorrasos livianos.', parentId: plasterAndDrywall.id },
      { name: 'Perfil metálico', description: 'Estructura de soporte para drywall.', parentId: plasterAndDrywall.id }
    ]
  });

  const rebarAndMesh = await prisma.category.create({
    data: {
      name: 'Fierros y Mallas',
      description: 'Refuerzo estructural para obras de concreto armado.',
      parentId: constructionMaterials.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Fierro corrugado', description: 'Refuerzo estructural para columnas y vigas.', parentId: rebarAndMesh.id },
      { name: 'Malla electrosoldada', description: 'Refuerzo para losas y pisos.', parentId: rebarAndMesh.id }
    ]
  });

  const constructionAdhesives = await prisma.category.create({
    data: {
      name: 'Adhesivos para Construcción',
      description: 'Pegamentos y fraguas para acabados de obra.',
      parentId: constructionMaterials.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Pegamento para cerámica', description: 'Fija cerámicos y porcelanatos a la superficie.', parentId: constructionAdhesives.id },
      { name: 'Fragua', description: 'Rellena y sella las juntas entre cerámicos.', parentId: constructionAdhesives.id }
    ]
  });

  // ==========================================================
  // 7. ADHESIVOS Y SELLADORES
  // ==========================================================
  const adhesivesAndSealants = await prisma.category.create({
    data: {
      name: 'Adhesivos y Selladores',
      description: 'Productos para pegar, sellar y proteger distintos materiales.',
      parentId: null
    }
  });

  const glues = await prisma.category.create({
    data: {
      name: 'Pegamentos',
      description: 'Adhesivos para unir materiales de uso general e industrial.',
      parentId: adhesivesAndSealants.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Pegamento de contacto', description: 'Unión fuerte e inmediata de superficies.', parentId: glues.id },
      { name: 'Pegamento PVA (blanco)', description: 'Ideal para madera y papel.', parentId: glues.id },
      { name: 'Pegamento epóxico', description: 'Alta resistencia para reparaciones exigentes.', parentId: glues.id }
    ]
  });

  const sealants = await prisma.category.create({
    data: {
      name: 'Selladores',
      description: 'Productos que evitan filtraciones de agua y aire.',
      parentId: adhesivesAndSealants.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Silicona', description: 'Sella juntas en baño, cocina y vidrios.', parentId: sealants.id },
      { name: 'Sellador de poliuretano', description: 'Alta elasticidad para juntas de construcción.', parentId: sealants.id }
    ]
  });

  const technicalTapes = await prisma.category.create({
    data: {
      name: 'Cintas Técnicas',
      description: 'Cintas adhesivas para distintos usos industriales y domésticos.',
      parentId: adhesivesAndSealants.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Cinta aislante', description: 'Aísla y protege empalmes eléctricos.', parentId: technicalTapes.id },
      { name: 'Cinta doble contacto', description: 'Fijación fuerte sin tornillos ni clavos.', parentId: technicalTapes.id },
      { name: 'Cinta de embalaje', description: 'Sella cajas y paquetes de forma segura.', parentId: technicalTapes.id }
    ]
  });

  // ==========================================================
  // 8. CERRAJERÍA Y HERRAJES
  // ==========================================================
  const locksmithAndHardware = await prisma.category.create({
    data: {
      name: 'Cerrajería y Herrajes',
      description: 'Sistemas de seguridad y accesorios para puertas y muebles.',
      parentId: null
    }
  });

  const locks = await prisma.category.create({
    data: {
      name: 'Cerraduras',
      description: 'Mecanismos de cierre y seguridad para puertas.',
      parentId: locksmithAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Cerradura de pomo', description: 'Uso común en puertas interiores.', parentId: locks.id },
      { name: 'Cerradura de perilla', description: 'Sistema práctico para acceso rápido.', parentId: locks.id },
      { name: 'Cerradura digital', description: 'Apertura por clave o huella digital.', parentId: locks.id }
    ]
  });

  const padlocks = await prisma.category.create({
    data: {
      name: 'Candados',
      description: 'Sistemas portátiles de seguridad.',
      parentId: locksmithAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Candado de combinación', description: 'Apertura mediante código numérico.', parentId: padlocks.id },
      { name: 'Candado de llave', description: 'Seguridad tradicional con llave física.', parentId: padlocks.id }
    ]
  });

  const hingesAndSliders = await prisma.category.create({
    data: {
      name: 'Bisagras y Correderas',
      description: 'Elementos de movimiento para puertas y muebles.',
      parentId: locksmithAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Bisagra', description: 'Permite el giro de puertas y ventanas.', parentId: hingesAndSliders.id },
      { name: 'Corredera para cajones', description: 'Facilita el deslizamiento suave de cajones.', parentId: hingesAndSliders.id }
    ]
  });

  const doorAccessories = await prisma.category.create({
    data: {
      name: 'Accesorios para Puertas',
      description: 'Complementos funcionales y decorativos para puertas.',
      parentId: locksmithAndHardware.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Manija', description: 'Facilita la apertura y cierre de puertas.', parentId: doorAccessories.id },
      { name: 'Tope de puerta', description: 'Evita golpes y daños en la pared.', parentId: doorAccessories.id },
      { name: 'Cerrojo', description: 'Refuerza la seguridad de puertas y ventanas.', parentId: doorAccessories.id }
    ]
  });

  // ==========================================================
  // 9. MEDICIÓN Y NIVELACIÓN
  // ==========================================================
  const measurementAndLeveling = await prisma.category.create({
    data: {
      name: 'Medición y Nivelación',
      description: 'Instrumentos de precisión para medir, nivelar y trazar.',
      parentId: null
    }
  });

  const measuringInstruments = await prisma.category.create({
    data: {
      name: 'Instrumentos de Medición',
      description: 'Herramientas para tomar medidas exactas en obra.',
      parentId: measurementAndLeveling.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Wincha', description: 'Cinta métrica para medidas de largo alcance.', parentId: measuringInstruments.id },
      { name: 'Calibrador (pie de rey)', description: 'Mediciones de alta precisión en piezas pequeñas.', parentId: measuringInstruments.id },
      { name: 'Flexómetro', description: 'Medición práctica y portátil de distancias cortas.', parentId: measuringInstruments.id }
    ]
  });

  const levels = await prisma.category.create({
    data: {
      name: 'Niveles',
      description: 'Instrumentos para verificar horizontalidad y verticalidad.',
      parentId: measurementAndLeveling.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Nivel de burbuja', description: 'Verifica el nivel de superficies manualmente.', parentId: levels.id },
      { name: 'Nivel láser', description: 'Proyecta líneas de referencia con precisión.', parentId: levels.id }
    ]
  });

  const squaresAndMarking = await prisma.category.create({
    data: {
      name: 'Escuadras y Trazado',
      description: 'Herramientas para marcar ángulos y líneas de corte.',
      parentId: measurementAndLeveling.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Escuadra metálica', description: 'Traza ángulos rectos con precisión.', parentId: squaresAndMarking.id },
      { name: 'Tiralíneas', description: 'Marca líneas rectas de referencia en superficies.', parentId: squaresAndMarking.id }
    ]
  });

  // ==========================================================
  // 10. SEGURIDAD INDUSTRIAL (EPP)
  // ==========================================================
  const industrialSafety = await prisma.category.create({
    data: {
      name: 'Seguridad Industrial (EPP)',
      description: 'Equipos de protección personal para trabajar de forma segura.',
      parentId: null
    }
  });

  const handProtection = await prisma.category.create({
    data: {
      name: 'Protección de Manos',
      description: 'Guantes para distintos niveles de riesgo laboral.',
      parentId: industrialSafety.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Guante de cuero', description: 'Resistencia general para trabajo pesado.', parentId: handProtection.id },
      { name: 'Guante de nitrilo', description: 'Protección química y buen agarre.', parentId: handProtection.id },
      { name: 'Guante anticorte', description: 'Protección ante bordes filosos y cortantes.', parentId: handProtection.id }
    ]
  });

  const headProtection = await prisma.category.create({
    data: {
      name: 'Protección de Cabeza',
      description: 'Elementos que protegen contra impactos y caídas de objetos.',
      parentId: industrialSafety.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Casco de seguridad', description: 'Protección ante impactos en obra.', parentId: headProtection.id },
      { name: 'Banda para casco', description: 'Ajuste cómodo y transpirable.', parentId: headProtection.id }
    ]
  });

  const visualAndHearingProtection = await prisma.category.create({
    data: {
      name: 'Protección Visual y Auditiva',
      description: 'Equipos que protegen ojos y oídos en entornos ruidosos o riesgosos.',
      parentId: industrialSafety.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Lentes de seguridad', description: 'Protegen los ojos de partículas y salpicaduras.', parentId: visualAndHearingProtection.id },
      { name: 'Tapón auditivo', description: 'Reduce la exposición a ruidos intensos.', parentId: visualAndHearingProtection.id },
      { name: 'Orejera de protección', description: 'Aísla el ruido en ambientes industriales.', parentId: visualAndHearingProtection.id }
    ]
  });

  const respiratoryProtection = await prisma.category.create({
    data: {
      name: 'Protección Respiratoria',
      description: 'Equipos que filtran el aire para proteger las vías respiratorias.',
      parentId: industrialSafety.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Mascarilla', description: 'Protección básica contra polvo y partículas.', parentId: respiratoryProtection.id },
      { name: 'Respirador con filtro', description: 'Protección avanzada contra vapores y químicos.', parentId: respiratoryProtection.id }
    ]
  });

  // ==========================================================
  // 11. JARDÍN Y EXTERIORES
  // ==========================================================
  const gardenAndOutdoor = await prisma.category.create({
    data: {
      name: 'Jardín y Exteriores',
      description: 'Herramientas y equipos para el cuidado de jardines y áreas exteriores.',
      parentId: null
    }
  });

  const gardenTools = await prisma.category.create({
    data: {
      name: 'Herramientas de Jardín',
      description: 'Utensilios manuales para el cuidado de plantas y jardines.',
      parentId: gardenAndOutdoor.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Pala', description: 'Remueve tierra y traslada materiales.', parentId: gardenTools.id },
      { name: 'Rastrillo', description: 'Recoge hojas y nivela el terreno.', parentId: gardenTools.id },
      { name: 'Tijera de podar', description: 'Corta ramas y mantiene las plantas.', parentId: gardenTools.id }
    ]
  });

  const irrigation = await prisma.category.create({
    data: {
      name: 'Riego',
      description: 'Sistemas y accesorios para el riego de áreas verdes.',
      parentId: gardenAndOutdoor.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Manguera', description: 'Conduce agua para el riego del jardín.', parentId: irrigation.id },
      { name: 'Aspersor', description: 'Distribuye agua de forma uniforme.', parentId: irrigation.id },
      { name: 'Conector de riego', description: 'Une y adapta mangueras y accesorios.', parentId: irrigation.id }
    ]
  });

  const gardenMachinery = await prisma.category.create({
    data: {
      name: 'Maquinaria de Jardín',
      description: 'Equipos motorizados para el mantenimiento de áreas verdes.',
      parentId: gardenAndOutdoor.id
    }
  });

  await prisma.category.createMany({
    data: [
      { name: 'Cortadora de césped', description: 'Mantiene el césped parejo y cuidado.', parentId: gardenMachinery.id },
      { name: 'Motosierra', description: 'Corte de ramas y troncos de mayor grosor.', parentId: gardenMachinery.id }
    ]
  });

  // ============================================================
  // CATEGORY ATTRIBUTES
  // ============================================================

  const createAttributes = async (
    categoryId: number,
    attributes: {
      name: string;
      key: string;
      type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT';
      required?: boolean;
    }[]
  ) => {
    await prisma.categoryAttribute.createMany({
      data: attributes.map((attribute) => ({
        ...attribute,
        categoryId
      }))
    });
  };

  // ------------------------------------------------------------
  // HERRAMIENTAS MANUALES
  // ------------------------------------------------------------

  await createAttributes(screwdrivers.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Tipo de punta',
      key: 'tip_type',
      type: 'SELECT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(pliers.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Tipo de mango',
      key: 'handle_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(wrenches.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Medida',
      key: 'size',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Tipo',
      key: 'wrench_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(hammers.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Peso',
      key: 'weight',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Material del mango',
      key: 'handle_material',
      type: 'TEXT'
    }
  ]);

  await createAttributes(chiselsAndGouges.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Ancho',
      key: 'width',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(sawsAndHacksaws.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Tipo de hoja',
      key: 'blade_type',
      type: 'SELECT'
    }
  ]);

  // ------------------------------------------------------------
  // HERRAMIENTAS ELÉCTRICAS
  // ------------------------------------------------------------

  await createAttributes(drills.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Modelo',
      key: 'model',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Potencia',
      key: 'power',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Inalámbrico',
      key: 'cordless',
      type: 'BOOLEAN'
    }
  ]);

  await createAttributes(grinders.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Modelo',
      key: 'model',
      type: 'TEXT'
    },
    {
      name: 'Potencia',
      key: 'power',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Diámetro de disco',
      key: 'disc_diameter',
      type: 'NUMBER'
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(sanders.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Modelo',
      key: 'model',
      type: 'TEXT'
    },
    {
      name: 'Potencia',
      key: 'power',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Tipo de lijadora',
      key: 'sander_type',
      type: 'SELECT'
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(electricSaws.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Modelo',
      key: 'model',
      type: 'TEXT'
    },
    {
      name: 'Potencia',
      key: 'power',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER'
    },
    {
      name: 'Diámetro de hoja',
      key: 'blade_diameter',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(weldingEquipment.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Modelo',
      key: 'model',
      type: 'TEXT'
    },
    {
      name: 'Potencia',
      key: 'power',
      type: 'NUMBER'
    },
    {
      name: 'Corriente máxima',
      key: 'max_current',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER'
    }
  ]);

  // ------------------------------------------------------------
  // ELECTRICIDAD
  // ------------------------------------------------------------

  await createAttributes(cablesAndConductors.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Calibre',
      key: 'gauge',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    }
  ]);

  await createAttributes(switchesAndOutlets.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER'
    },
    {
      name: 'Amperaje',
      key: 'amperage',
      type: 'NUMBER'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    }
  ]);

  await createAttributes(lighting.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Potencia',
      key: 'power',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER'
    },
    {
      name: 'Color de luz',
      key: 'light_color',
      type: 'SELECT'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    }
  ]);

  await createAttributes(panelsAndProtection.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Amperaje',
      key: 'amperage',
      type: 'NUMBER'
    },
    {
      name: 'Número de polos',
      key: 'poles',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(cableManagement.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    }
  ]);

  // ------------------------------------------------------------
  // GASFITERÍA Y PLOMERÍA
  // ------------------------------------------------------------

  await createAttributes(pipesAndFittings.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Tipo de conexión',
      key: 'connection_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(valves.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Tipo de conexión',
      key: 'connection_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(faucets.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Tipo de instalación',
      key: 'installation_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(installationAccessories.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(waterPumps.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Modelo',
      key: 'model',
      type: 'TEXT'
    },
    {
      name: 'Potencia',
      key: 'power',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Voltaje',
      key: 'voltage',
      type: 'NUMBER'
    },
    {
      name: 'Caudal',
      key: 'flow_rate',
      type: 'NUMBER'
    }
  ]);

  // ------------------------------------------------------------
  // PINTURAS Y ACABADOS
  // ------------------------------------------------------------

  await createAttributes(paints.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Acabado',
      key: 'finish',
      type: 'SELECT'
    },
    {
      name: 'Contenido',
      key: 'content',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Uso exterior',
      key: 'exterior_use',
      type: 'BOOLEAN'
    }
  ]);

  await createAttributes(paintingTools.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Ancho',
      key: 'width',
      type: 'NUMBER'
    },
    {
      name: 'Tamaño',
      key: 'size',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(paintingAccessories.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Tamaño',
      key: 'size',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(surfacePreparation.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Contenido',
      key: 'content',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Uso exterior',
      key: 'exterior_use',
      type: 'BOOLEAN'
    }
  ]);

  // ------------------------------------------------------------
  // FIJACIONES Y TORNILLERÍA
  // ------------------------------------------------------------

  await createAttributes(screws.id, [
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Tipo de rosca',
      key: 'thread_type',
      type: 'SELECT'
    },
    {
      name: 'Acabado',
      key: 'finish',
      type: 'SELECT'
    }
  ]);

  await createAttributes(boltsAndNuts.id, [
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Tipo de rosca',
      key: 'thread_type',
      type: 'SELECT'
    },
    {
      name: 'Acabado',
      key: 'finish',
      type: 'SELECT'
    }
  ]);

  await createAttributes(washers.id, [
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro interior',
      key: 'inner_diameter',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Diámetro exterior',
      key: 'outer_diameter',
      type: 'NUMBER'
    },
    {
      name: 'Tipo',
      key: 'washer_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(anchors.id, [
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Tipo de instalación',
      key: 'installation_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(nailsAndStaples.id, [
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER'
    },
    {
      name: 'Acabado',
      key: 'finish',
      type: 'SELECT'
    }
  ]);

  // ------------------------------------------------------------
  // MATERIALES DE CONSTRUCCIÓN
  // ------------------------------------------------------------

  await createAttributes(cementAndAggregates.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Peso',
      key: 'weight',
      type: 'NUMBER'
    },
    {
      name: 'Presentación',
      key: 'presentation',
      type: 'SELECT',
      required: true
    }
  ]);

  await createAttributes(plasterAndDrywall.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Peso',
      key: 'weight',
      type: 'NUMBER'
    },
    {
      name: 'Presentación',
      key: 'presentation',
      type: 'SELECT'
    }
  ]);

  await createAttributes(rebarAndMesh.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(constructionAdhesives.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Contenido',
      key: 'content',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Uso exterior',
      key: 'exterior_use',
      type: 'BOOLEAN'
    }
  ]);

  // ------------------------------------------------------------
  // ADHESIVOS Y SELLADORES
  // ------------------------------------------------------------

  await createAttributes(glues.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Contenido',
      key: 'content',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Uso exterior',
      key: 'exterior_use',
      type: 'BOOLEAN'
    }
  ]);

  await createAttributes(sealants.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Contenido',
      key: 'content',
      type: 'NUMBER',
      required: true
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Uso exterior',
      key: 'exterior_use',
      type: 'BOOLEAN'
    }
  ]);

  await createAttributes(technicalTapes.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Ancho',
      key: 'width',
      type: 'NUMBER'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    }
  ]);

  // ------------------------------------------------------------
  // CERRAJERÍA Y HERRAJES
  // ------------------------------------------------------------

  await createAttributes(locks.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Tipo de instalación',
      key: 'installation_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(padlocks.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Tamaño',
      key: 'size',
      type: 'NUMBER'
    },
    {
      name: 'Tipo de apertura',
      key: 'opening_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(hingesAndSliders.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Capacidad de carga',
      key: 'load_capacity',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(doorAccessories.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT'
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Tipo de instalación',
      key: 'installation_type',
      type: 'SELECT'
    }
  ]);

  // ------------------------------------------------------------
  // MEDICIÓN Y NIVELACIÓN
  // ------------------------------------------------------------

  await createAttributes(measuringInstruments.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Precisión',
      key: 'precision',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(levels.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Precisión',
      key: 'precision',
      type: 'NUMBER'
    },
    {
      name: 'Tipo',
      key: 'level_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(squaresAndMarking.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Precisión',
      key: 'precision',
      type: 'NUMBER'
    }
  ]);

  // ------------------------------------------------------------
  // SEGURIDAD INDUSTRIAL
  // ------------------------------------------------------------

  await createAttributes(handProtection.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Talla',
      key: 'size',
      type: 'SELECT'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Reutilizable',
      key: 'reusable',
      type: 'BOOLEAN'
    }
  ]);

  await createAttributes(headProtection.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Talla',
      key: 'size',
      type: 'SELECT'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    }
  ]);

  await createAttributes(visualAndHearingProtection.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Tipo',
      key: 'protection_type',
      type: 'SELECT'
    },
    {
      name: 'Color',
      key: 'color',
      type: 'TEXT'
    },
    {
      name: 'Reutilizable',
      key: 'reusable',
      type: 'BOOLEAN'
    }
  ]);

  await createAttributes(respiratoryProtection.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Tipo de protección',
      key: 'protection_type',
      type: 'SELECT',
      required: true
    },
    {
      name: 'Tipo de filtro',
      key: 'filter_type',
      type: 'SELECT'
    },
    {
      name: 'Reutilizable',
      key: 'reusable',
      type: 'BOOLEAN'
    }
  ]);

  // ------------------------------------------------------------
  // JARDÍN Y EXTERIORES
  // ------------------------------------------------------------

  await createAttributes(gardenTools.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Tipo de mango',
      key: 'handle_type',
      type: 'SELECT'
    }
  ]);

  await createAttributes(irrigation.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Material',
      key: 'material',
      type: 'TEXT'
    },
    {
      name: 'Diámetro',
      key: 'diameter',
      type: 'NUMBER'
    },
    {
      name: 'Longitud',
      key: 'length',
      type: 'NUMBER'
    },
    {
      name: 'Presión máxima',
      key: 'max_pressure',
      type: 'NUMBER'
    }
  ]);

  await createAttributes(gardenMachinery.id, [
    {
      name: 'Marca',
      key: 'brand',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Modelo',
      key: 'model',
      type: 'TEXT',
      required: true
    },
    {
      name: 'Potencia',
      key: 'power',
      type: 'NUMBER'
    },
    {
      name: 'Cilindrada',
      key: 'engine_displacement',
      type: 'NUMBER'
    },
    {
      name: 'Uso profesional',
      key: 'professional_use',
      type: 'BOOLEAN'
    }
  ]);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
