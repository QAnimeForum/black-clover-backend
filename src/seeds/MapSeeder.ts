import { CreateStateDto } from '../app/modules/map/dto/create-state.dto';
import { StateEntity } from '../app/modules/map/enitity/state.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CreateStateFormDto } from '../app/modules/map/dto/create-state-form.dto';
import { StateFormEntity } from '../app/modules/map/enitity/state.form.entity';

export default class MapSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const stateFormRepository = dataSource.getRepository(StateFormEntity);

        const dateStateForm: CreateStateFormDto[] = [
            {
                name: 'Бейлик',
                description:
                    'турецкое княжество/герцогство, которым управляет «бей» (вождь). Обычно меньше.',
            },
            {
                name: 'Халифат',
                description:
                    'исламское государство, которым управляет один или группа «халифов», человек, считающийся политико-религиозным преемником исламского пророка Мухаммеда и лидером всей уммы (мусульманской общины). Довольно большой.',
            },
            {
                name: 'Город-государство',
                description:
                    ' это суверенное микрогосударство, которое обычно состоит из одного города и зависимых от него территорий. Исторически сюда входили такие города, как Рим, Афины, Карфаген и итальянские города-государства эпохи Возрождения.',
            },
            {
                name: 'Содружество',
                description:
                    ' политическое сообщество, созданное для общего блага. По сути, причудливое название, которое вообще не ограничивает способы управления землей.',
            },
            {
                name: 'Конфедерация',
                description:
                    'Cоюз суверенных групп или государств, объединившихся в целях совместных действий. Обычно создаваемые договором конфедерации государств, как правило, создаются для решения важнейших вопросов, таких как оборона, международные отношения, внутренняя торговля или валюта, при этом общее правительство обязано оказывать поддержку всем своим членам.',
            },
            {
                name: 'Конгломерат',
                description: 'группа или кластер наций.',
            },
            {
                name: 'Деспотат',
                description:
                    '- империя, за исключением управляемой сыном или зятем (или принцем), известным как «деспоты». Может также означать форму правления, при которой единое целое правит с абсолютной властью. Обычно этим субъектом является человек, деспот, как в автократии, но общества, которые ограничивают уважение и власть определенными группами, также называются деспотическими.',
            },
            {
                name: 'Двоевластие',
                description: ' Монархия, но с двумя людьми.',
            },
            {
                name: 'Епархия',
                description:
                    'церковный (христианский) округ, находящийся в ведении епископа. Обычно довольно маленький и является частью чего-то большего.',
            },
            {
                name: 'Герцогство',
                description:
                    ' средневековая страна, территория, феодальное владение или домен, управляемый герцогом или герцогиней, высокопоставленным дворянином, иерархически вторым после короля или королевы.',
            },
            {
                name: 'Эмират',
                description:
                    'политическая территория, которой управляет династический (семейный) арабский или исламский эмир в стиле монарха (король или дворянин - военный титул).',
            },
            {
                name: 'Империя',
                description:
                    ' огромная территория, управляемая императором или монархом. Обычно имеет большую армию и ориентирован на расширение.',
            },
            {
                name: 'Епархия',
                description: 'группа провинций.',
            },
            {
                name: 'Федерация',
                description:
                    '  политическое образование, характеризующееся союзом частично самоуправляющихся провинций, штатов или других регионов под центральным федеральным правительством (федерализм). В федерации статус самоуправления входящих в ее состав штатов, а также разделение власти между ними и центральным правительством обычно закреплены конституцией и не могут быть изменены односторонним решением любой из сторон, штатов или федерального правительства. политический орган. Альтернативно, федерация — это форма правления, при которой суверенная власть формально разделена между центральной властью и рядом составляющих регионов, так что каждый регион сохраняет некоторую степень контроля над своими внутренними делами.',
            },
            {
                name: ' Вольный город',
                description:
                    '   самоуправляемый город в эпоху эллинизма и Римской империи. Статус давался королем или императором, который, тем не менее, контролировал дела города через своих эпистатов или куратора (греч. epimeletes) соответственно. Несколько автономных городов также имели право выпускать гражданские монеты с названием города.',
            },
            {
                name: 'Великое Герцогство',
                description:
                    '    страна или территория, официальным главой государства или правителем которой является монарх, носящий титул великого князя или великой княгини. Этот термин часто использовался в официальном названии стран, меньших, чем большинство континентальных королевств современной Европы (например, Дания, Испания, Великобритания), но более крупных, чем большинство суверенных герцогств в Священной Римской империи, Италии или Скандинавии (например, Ангальт, Лотарингия, Модена, Шлезвиг-Гольштейн).',
            },
            {
                name: 'Гептархия',
                description:
                    'собирательное название семи королевств англосаксонской Англии. Историографическая традиция «семи королевств» является средневековой и впервые записана Генрихом Хантингдонским в его Historia Anglorum (12 век).',
            },
            {
                name: 'Орда',
                description:
                    'историческая социально-политическая и военная структура в степных кочевнических культурах, таких как тюрки и монголы. Это образование можно рассматривать как региональный эквивалент клана или племени.',
            },
            {
                name: 'Имам',
                description:
                    'означает «руководство» и относится к должности имама или государству, которым управляет имам (должность исламского лидерства - чаще всего используется как титул лидера поклонения мечети и мусульманской общины среди мусульман-суннитов. В В этом контексте имамы могут руководить исламскими богослужениями, выступать в качестве лидеров общин и обеспечивать религиозное руководство. В Йемене этот титул ранее присваивался королю страны).',
            },
            {
                name: 'Каганат',
                description:
                    'политическое образование, управляемое ханом (правителем или военачальником) или каганом (титул императорского ранга в тюркских, монгольских и некоторых других языках, приравниваемый к статусу императора и того, кто управляет каганатом (империей)) . Это политическое образование типично для народов Евразийской степи и может быть эквивалентно племенному вождеству, княжеству, царству или империи. ',
            },
            {
                name: 'Ханство',
                description: 'cм. выше.',
            },

            {
                name: 'Королевство',
                description:
                    'монархическое государственное образование, во главе которого стоит король.',
            },
            {
                name: 'Лига',
                description:
                    'Ассоциация городов-государств, обычно управляемая чем-то более крупным.',
            },
            {
                name: 'Марши',
                description:
                    'любое пограничье, в отличие от условного «хартленда». Точнее, марш представлял собой границу между королевствами и/или нейтральную/буферную зону под совместным контролем двух государств, в которой могли применяться разные законы. В обоих этих смыслах марши служили политическим целям, таким как предупреждение о военных вторжениях или регулирование трансграничной торговли, или и то, и другое. Точно так же, как графства традиционно управлялись графами, марши породили такие титулы, как маркиз (мужской род) или маркиза (женский род) в Англии, маркиз (мужской род) или маркиза (женский род) во Франции и Шотландии, маркграф (Markgraf т.е. «график маршей»). ; мужской род) или маркграфин (Markgräfin, т. е. «мартовская графиня», женский род) в Германии и соответствующие титулы в других европейских государствах.',
            },
            {
                name: 'Олигархия',
                description:
                    'форма правления, при которой власть принадлежит небольшому числу людей. Эти люди могут отличаться благородством, богатством, образованием или корпоративным, религиозным, политическим или военным контролем. Такие государства часто контролируются семьями, которые обычно передают свое влияние от одного поколения к другому, но наследование не является необходимым условием для применения этого термина. На протяжении всей истории олигархии часто были тираническими, полагаясь на общественное повиновение или угнетение.',
            },
            {
                name: 'Княжество',
                description:
                    ' может быть монархическим феодальным или суверенным государством, которым управляет или управляет монарх с титулом принца или монарх с другим титулом, который, как считается, подпадает под общее значение термина принц. Большинство этих государств исторически были политическими образованиями, но в некоторых случаях они представляли собой скорее территории, в отношении которых носил княжеский титул. Поместья и богатства князя могут располагаться преимущественно или полностью за пределами географических границ княжества. ',
            },
            {
                name: 'Протекторат',
                description:
                    ' зависимая территория, которой была предоставлена местная автономия и некоторая независимость, но при этом сохраняется сюзеренитет более крупного суверенного государства. В обмен на это протекторат обычно принимает на себя определенные обязательства, которые могут сильно различаться в зависимости от реального характера их отношений. Таким образом, протекторат остается автономной частью суверенного государства. Они отличаются от колоний, поскольку их территорией правят местные правители и люди, а также наблюдаются редкие случаи иммиграции поселенцев из страны, сюзеренитетом которой они являются. Однако государство, которое остается под защитой другого государства, но при этом сохраняет независимость, называется защищенным государством и отличается от протекторатов.',
            },
            {
                name: 'Республика',
                description:
                    'форма правления, при которой страна считается «общественным делом», а не частным делом или собственностью правителей. Основные позиции власти в республике достигаются посредством демократии, олигархии, автократии или их сочетания, а не путем неизменной оккупации. По существу, оно стало формой правления, противоположной монархии, и, следовательно, не имеет монарха в качестве главы государства.    ',
            },
            {
                name: 'Сатрапия',
                description:
                    ' провинция, управляемая сатрапом (наместником короля, хотя и со значительной автономией).',
            },
            {
                name: 'Сёгунат',
                description:
                    'военные диктаторы, номинально назначаемые императором, сёгуны обычно были фактическими правителями страны. Должность сёгуна на практике передавалась по наследству, хотя на протяжении истории Японии эту должность занимало несколько разных кланов.',
            },
            {
                name: 'Султанат',
                description:
                    'определенные правители, которые на практике претендовали на почти полный суверенитет (т. Е. На отсутствие зависимости от какого-либо более высокого правителя), хотя и не претендовали на общий халифат или не имели в виду могущественного губернатора провинции в составе халифата. Использование слова «султан» ограничено мусульманскими странами, где этот титул имеет религиозное значение, в отличие от более светского короля, который используется как в мусульманских, так и в немусульманских странах.',
            },
            {
                name: 'Тетрархия',
                description:
                    ' любая форма правления, при которой власть разделена между четырьмя лицами. Этот термин использовался для описания независимых частей королевства, которыми управляли отдельные лидеры. Каждое из них является эквивалентом королевства, а также частью одного из них. Иудейская тетрархия представляла собой совокупность четырех независимых и отдельных государств, в которых каждый тетрарх управлял четвертью царства по своему усмотрению. ',
            },
            {
                name: 'Теократия',
                description:
                    'форма правления, при которой Бог или божество какого-либо типа признается высшей правящей властью, дающей божественное руководство человеческим посредникам, управляющим повседневными делами правительства. В некоторых религиях правитель, обычно король, считался избранным фаворитом Бога (или богов) и не мог подвергаться сомнению, а иногда даже был потомком бога или самостоятельным богом. Сегодня также существует форма правления, при которой священнослужители имеют власть, а верховный лидер не может быть допрошен в действии. Считается, что в чистой теократии гражданский лидер имеет личную связь с религией или убеждениями цивилизации. Например, Моисей возглавлял израильтян, а Мухаммед возглавлял первых мусульман. ',
            },
            {
                name: 'Торговая компания',
                description:
                    ' компания, не только контролирующая товары, но и владеющая землей, а также частными армиями.',
            },
            {
                name: 'Племена',
                description:
                    'Термин «племя» используется во многих различных контекстах для обозначения категории человеческой социальной группы. Это определение оспаривается, отчасти из-за противоречивых теоретических представлений о социальных и родственных структурах, а также из-за проблемного применения этой концепции к чрезвычайно разнообразным человеческим обществам. Антропологи часто противопоставляют эту концепцию другим социальным и родственным группам, которые иерархически больше, чем линия или клан, но меньше, чем вождество, нация или государство. Эти условия в равной степени оспариваются. В некоторых случаях племена имеют юридическое признание и некоторую степень политической автономии от национального или федерального правительства, но такое легалистическое использование этого термина может противоречить антропологическим определениям.',
            },
            {
                name: 'Триумвират',
                description:
                    'политический режим, которым управляют или доминируют три влиятельных человека, известные как триумвиры (лат. triumviri). Договоренность может быть формальной или неформальной. Хотя эти трое теоретически равны, на самом деле такое случается редко. Этот термин также можно использовать для описания государства с тремя разными военными лидерами, каждый из которых утверждает, что является единственным лидером.',
            },
            {
                name: 'Царство',
                description:
                    'управляемое царем (восточными и южнославянскими монархами или верховными правителями Восточной Европы) - правителем того же ранга, что и римский император, занимающим его с одобрения другого императора или высшего церковного должностного лица (Папы или Вселенского Патриарх), но западные европейцы обычно считали его эквивалентом короля или чем-то средним между королевским и императорским рангом',
            },
            {
                name: 'Демократия',
                description:
                    'форма правления, при которой люди имеют право выбирать действующее законодательство. Кто такие люди и как между ними распределяется власть, являются ключевыми вопросами демократического развития и конституции. Некоторыми краеугольными камнями этих вопросов являются свобода собраний и слова, инклюзивность и равенство, членство, согласие, голосование, право на жизнь и права меньшинств.',
            },
            {
                name: 'Социализм',
                description:
                    ' политическая власть принадлежит рабочему классу.',
            },
            {
                name: 'Прямая демократия',
                description:
                    ' форма демократии, при которой люди принимают решения о политических инициативах напрямую. Это отличается от большинства существующих в настоящее время демократий, которые являются представительными демократиями. Теория и практика прямой демократии и участия как ее общая характеристика составляли основу работ многих теоретиков, философов и политиков.',
            },
            {
                name: 'Плутократия',
                description:
                    'общество, которым управляют или контролируют люди с большим богатством или доходом.',
            },
            {
                name: 'Геронтократия',
                description:
                    'Форма олигархического правления, при которой субъектом управляют лидеры, значительно старше большей части взрослого населения.',
            },
            {
                name: 'Диктатура',
                description:
                    'Авторитарная форма правления, характеризующаяся одним лидером или группой лидеров и малой или нулевой терпимостью к политическому плюрализму, независимым программам или средствам массовой информации. Общим аспектом, характеризующим диктатуру, является использование их сильной личности, обычно путем подавления свободы мысли и слова масс, чтобы поддерживать полное политическое и социальное превосходство и стабильность. Диктатуры и тоталитарные общества обычно используют политическую пропаганду, чтобы уменьшить влияние сторонников альтернативных систем правления.',
            },
            {
                name: 'Анархия',
                description:
                    ' состояние общества, свободно учреждаемого без властей или руководящего органа.',
            },
            {
                name: 'Доминион',
                description:
                    'Независимое королевство Содружества, отколовшееся от более крупной империи.',
            },
        ];
        const stateFormEntities: StateFormEntity[] = dateStateForm.map(
            (item: CreateStateFormDto) => {
                const entity = new StateFormEntity();
                entity.name = item.name;
                entity.description = item.description;
                return entity;
            }
        );
        await stateFormRepository.insert(stateFormEntities);
        const formEntity = await stateFormRepository.find({
            where: {
                name: 'Королевство',
            },
        });

        if (formEntity.length == 0) {
            return 0;
        }
        const stateRepository = dataSource.getRepository(StateEntity);

        const datsStates: CreateStateDto[] = [
            {
                name: 'Королевство Клевер',
                fullName: '',
                description: '',
                formId: formEntity[0].id,
            },
            {
                name: 'Королевство Пик',
                fullName: '',
                description: '',
                formId: formEntity[0].id,
            },
            {
                name: 'Королевство Алмаза',
                fullName: '',
                description: '',
                formId: formEntity[0].id,
            },
            {
                name: 'Королевство Сердца',
                fullName: '',
                description: '',
                formId: formEntity[0].id,
            },
        ];
        const create: StateEntity[] = datsStates.map(
            ({ name, description, fullName }) => {
                const entity: StateEntity = new StateEntity();
                entity.name = name;
                entity.fullName = fullName;
                entity.description = description;
                return entity;
            }
        );
        await stateRepository.insert(create);
    }
}

/**
 * 
 * 
 * * 
 * Beylik - Turkish principality/duchy, ruled by a "bey" (chieftain). Typically smaller.

Caliphate - Islamic state ruled by one or a group of "caliph", a person considered a political-religious successor to the Islamic prophet Muhammad and a leader of the entire ummah (Muslim community). Quite large.

City-state - A city-state is a sovereign microstate that usually consists of a single city and its dependent territories. Historically, this included cities such as Rome, Athens, Carthage, and the Italian city-states during the Renaissance.

Commonwealth - a political community founded for the common good. Basically a fancy title that doesn't limit the way the land is governed at all

Confederacy - a union of sovereign groups or states, united for purposes of common action. Usually created by a treaty, confederations of states tend to be established for dealing with critical issues, such as defense, foreign relations, internal trade or currency, with the general government being required to provide support for all its members.

Confederation - See above

Conglomerate - a group or cluster of nations

Despotate - An empire, except ruled by the son or son-in-law (or prince) known as "despots". Might also mean a form of government in which a single entity rules with absolute power. Normally, that entity is an individual, the despot, as in an autocracy, but societies which limit respect and power to specific groups have also been called despotic.

Diarchy - Monarchy but with two people

Diocese - the ecclesiastical (Christian) district under the jurisdiction of a bishop. Usually pretty small and part of a larger thing

Duchy - a medieval country, territory, fief, or domain ruled by a duke or duchess, a high-ranking nobleman hierarchically second to the king or queen

Emirate - a political territory that is ruled by a dynastic (familial) Arabic or Islamic monarch-styled emir (king or noble - military title)

Empire - bigass area ruled by an emperor or monarch. Typically has a big army and focused on expansion

Eparchy - A group of provinces

Federation - a political entity characterized by a union of partially self-governing provinces, states, or other regions under a central federal government (federalism). In a federation, the self-governing status of the component states, as well as the division of power between them and the central government, is typically constitutionally entrenched and may not be altered by a unilateral decision of either party, the states or the federal political body. Alternatively, a federation is a form of government in which sovereign power is formally divided between a central authority and a number of constituent regions so that each region retains some degree of control over its internal affairs.

Free City - a self-governed city during the Hellenistic and Roman Imperial eras. The status was given by the king or emperor, who nevertheless supervised the city's affairs through his epistates or curator (Greek: epimeletes) respectively. Several autonomous cities had also the right to issue civic coinage bearing the name of the city.

Grand Duchy - a country or territory whose official head of state or ruler is a monarch bearing the title of grand duke or grand duchess. The term was often used in the official name of countries smaller than most continental kingdoms of modern Europe (e.g., Denmark, Spain, United Kingdom) yet larger than most of the sovereign duchies in the Holy Roman Empire, Italy or Scandinavia (e.g. Anhalt, Lorraine, Modena, Schleswig-Holstein).

Heptarchy - a collective name applied to the seven kingdoms of Anglo-Saxon England. The historiographical tradition of the ‘seven kingdoms’ is medieval, first recorded by Henry of Huntingdon in his Historia Anglorum (12th century)

Horde - a historic sociopolitical and military structure in steppe nomad cultures such as the Turks and Mongols. This entity can be seen as the regional equivalent of a clan or a tribe.

Imamah - means "leadership" and refers to the office of an imam or a state ruled by an imam (an Islamic leadership position - It is most commonly used as the title of a worship leader of a mosque and Muslim community among Sunni Muslims. In this context, imams may lead Islamic worship services, serve as community leaders, and provide religious guidance. In Yemen, the title was formerly given to the king of the country.).

Khaganate - a political entity ruled by a khan (a ruler or military leader) or khagan (a title of imperial rank in the Turkic, Mongolic and some other languages, equal to the status of emperor and someone who rules a khaganate (empire)). This political entity is typical for people from the Eurasian Steppe and it can be equivalent to tribal chiefdom, principality, kingdom or empire.

Khanate - See above

Kingdom - A realm (a community or territory over which a sovereign rules. The term is commonly used to describe a kingdom or other monarchical or dynastic state) ruled by a king or queen regnant

League - An association of city-states, typically governed by something larger.

Marches - any kind of borderland, as opposed to a notional "heartland". More specifically, a march was a border between realms, and/or a neutral/buffer zone under joint control of two states, in which different laws might apply. In both of these senses, marches served a political purpose, such as providing warning of military incursions, or regulating cross-border trade, or both. Just as counties were traditionally ruled by counts, marches gave rise to titles such as marquess (masculine) or marchioness (feminine) in England, marquis (masculine) or marquise (feminine) in France and Scotland, margrave (Markgraf i.e. "march count"; masculine) or margravine (Markgräfin i.e. "march countess", feminine) in Germany, and corresponding titles in other European states.

Oligarchy - a form of power structure in which power rests with a small number of people. These people may be distinguished by nobility, wealth, education or corporate, religious, political, or military control. Such states are often controlled by families who typically pass their influence from one generation to the next, but inheritance is not a necessary condition for the application of this term. Throughout history, oligarchies have often been tyrannical, relying on public obedience or oppression to exist.

Principality - can either be a monarchical feudatory or a sovereign state, ruled or reigned over by a monarch with the title of prince or by a monarch with another title considered to fall under the generic meaning of the term prince. Most of these states have historically been a polity, but in some occasions were rather territories in respect of which a princely title is held. The prince's estate and wealth may be located mainly or wholly outside the geographical confines of the principality.

Protectorate - a dependent territory that has been granted local autonomy and some independence while still retaining the suzerainty of a greater sovereign state. In exchange for this, the protectorate usually accepts specified obligations, which may vary greatly, depending on the real nature of their relationship. Therefore, a protectorate remains an autonomous part of a sovereign state. They are different from colonies as they have local rulers and people ruling over the territory and experience rare cases of immigration of settlers from the country it has suzerainty of. However, a state which remains under the protection of another state but still retains independence is known as a protected state and is different from protectorates.

Republic - a form of government in which the country is considered a "public matter", not the private concern or property of the rulers. The primary positions of power within a republic are attained, through democracy, oligarchy, autocracy, or a mix thereof, rather than being unalterably occupied. As such it has become the opposing form of government to a monarchy and has therefore no monarch as head of state.

Satrapy - a province ruled by a satrap (viceroy to the king, though with considerable autonomy)

Shogunate - military dictators nominally appointed by the Emperor, shōguns were usually the de facto rulers of the country. The office of shōgun was in practice hereditary, though over the course of the history of Japan several different clans held the position.

Sultanate - certain rulers who claimed almost full sovereignty in practical terms (i.e., the lack of dependence on any higher ruler), albeit without claiming the overall caliphate, or to refer to a powerful governor of a province within the caliphate. The use of "sultan" is restricted to Muslim countries, where the title carries religious significance, contrasting the more secular king, which is used in both Muslim and non-Muslim countries.

Tetrarchy - any form of government where power is divided among four individuals. The term was used to describe independent portions of a kingdom that were ruled under separate leaders. Each is the equivalent of a kingdom, and also part of one. The Judaean tetrarchy was a set of four independent and distinct states, where each tetrarch ruled a quarter of a kingdom as they saw fit

Theocracy - a form of government in which God or a deity of some type is recognized as the supreme ruling authority, giving divine guidance to human intermediaries that manage the day to day affairs of the government. In some religions, the ruler, usually a king, was regarded as the chosen favorite of God (or gods) and could not be questioned, sometimes even being the descendant of or a god in their own right. Today, there is also a form of government where clerics have the power and the supreme leader could not be questioned in action. In a pure theocracy, the civil leader is believed to have a personal connection with the civilization's religion or belief. For example, Moses led the Israelites, and Muhammad led the early Muslims.

Trade Company - A company not only in control of commodities, but owning land as well as private armies.

Tribes - The term tribe is used in many different contexts to refer to a category of human social group. The definition is contested, in part due to conflicting theoretical understandings of social and kinship structures, and also reflecting the problematic application of this concept to extremely diverse human societies. The concept is often contrasted by anthropologists with other social and kinship groups, being hierarchically larger than a lineage or clan, but smaller than a chiefdom, nation or state. These terms are equally disputed. In some cases tribes have legal recognition and some degree of political autonomy from national or federal government, but this legalistic usage of the term may conflict with anthropological definitions.

Triumvirate - a political regime ruled or dominated by three powerful individuals known as triumvirs (Latin: triumviri). The arrangement can be formal or informal. Though the three are notionally equal, this is rarely the case in reality. The term can also be used to describe a state with three different military leaders who all claim to be the sole leader.

Tsardom - ruled by a tsar (East and South Slavic monarchs or supreme rulers of Eastern Europe) - a ruler with the same rank as a Roman emperor, holding it by the approval of another emperor or a supreme ecclesiastical official (the Pope or the Ecumenical Patriarch)—but was usually considered by western Europeans to be equivalent to king, or to be somewhat in between a royal and imperial rank.

Ulus - see Horde

United Hordes/Kingdom/Provinces/Republic/States/Tribes

------Not in the Generator------

Democracy - a form of government in which the people have the authority to choose their governing legislation. Who people are and how authority is shared among them are core issues for democratic development and constitution. Some cornerstones of these issues are freedom of assembly and speech, inclusiveness and equality, membership, consent, voting, right to life and minority rights.

Socialist - the working class hold political power.

Direct democracy - a form of democracy in which people decide on policy initiatives directly. This differs from the majority of currently established democracies, which are representative democracies. The theory and practice of direct democracy and participation as its common characteristic was the core of work of many theorists, philosophers and politicians

Plutocracy - a society that is ruled or controlled by people of great wealth or income.

Gerontocracy - a form of oligarchical rule in which an entity is ruled by leaders who are significantly older than most of the adult population.

Dictatoriship - an authoritarian form of government, characterized by a single leader or group of leaders and little or no toleration for political pluralism or independent programs or media. A common aspect that characterized dictatorship is taking advantage of their strong personality, usually by suppressing freedom of thought and speech of the masses, in order to maintain complete political and social supremacy and stability. Dictatorships and totalitarian societies generally employ political propaganda to decrease the influence of proponents of alternative governing systems.

Anarchy - the state of a society being freely constituted without authorities or a governing body.

Dominion - an independent Commonwealth realm, broken away from a larger empire

Chiefdom - a form of hierarchical political organization in non-industrial societies usually based on kinship, and in which formal leadership is monopolized by the legitimate senior members of select families or 'houses'. These elites form a political-ideological aristocracy relative to the general group.
 */
