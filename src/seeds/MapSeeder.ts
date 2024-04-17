import { StateEntity } from '../app/modules/map/enitity/state.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { CreateStateFormDto } from '../app/modules/map/dto/create-state-form.dto';
import { StateFormEntity } from '../app/modules/map/enitity/state.form.entity';
import { ProvinceFormEntity } from '../app/modules/map/enitity/province.form.entity';
import { ProvinceEntity } from '../app/modules/map/enitity/province.entity';
import { BurgEntity } from '../app/modules/map/enitity/burg.entity';
import { stateForms } from '../../Assets/json/map/state.form.json';
import { provincesForms } from '../../Assets/json/map/province.form.json';
import { states } from '../../Assets/json/map/map.json';
export default class MapSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<any> {
        const stateFormRepository = dataSource.getRepository(StateFormEntity);
        const stateRepository = dataSource.getRepository(StateEntity);
        const provinceFormRepository =
            dataSource.getRepository(ProvinceFormEntity);
        const provinceRepository = dataSource.getRepository(ProvinceEntity);
        const burgsRepository = dataSource.getRepository(BurgEntity);
        const stateFormDto: CreateStateFormDto[] = stateForms;
        await stateFormRepository.insert(stateFormDto);
        await provinceFormRepository.insert(provincesForms);
        for (let i = 0; i < states.length; ++i) {
            const formEntity = await stateFormRepository.find({
                where: {
                    name: states[i].form,
                },
            });

            if (formEntity.length == 0) {
                return 0;
            }
            const stateEntity = (
                await stateRepository.insert({
                    name: states[i].name,
                    fullName: states[i].fullName,
                    symbol: states[i].symbol,
                    image: states[i].image,
                    //  coverSymbol: ENUM_STATE_SYMBOL[states[i].coverSymbol],
                    description: states[i].description,
                    form: formEntity[0],
                })
            ).raw[0];
            for (let j = 0; j < states[i].provinces.length; ++j) {
                const provinceformEntity = await provinceFormRepository.find({
                    where: {
                        name: states[i].provinces[j].form,
                    },
                });

                if (provinceformEntity.length == 0) {
                    return 0;
                }
                const province = await provinceRepository.insert({
                    shortName: states[i].provinces[j].shortName,
                    fullName: states[i].provinces[j].shortName,
                    image: states[i].provinces[j].image,
                    form: provinceformEntity[0],
                    state: stateEntity,
                });

                for (let k = 0; k < states[i].provinces[j].burgs.length; ++k) {
                    await burgsRepository.insert({
                        name: states[i].provinces[j].burgs[k].name,
                        description:
                            states[i].provinces[j].burgs[k].description,
                        image: states[i].provinces[j].burgs[k].image,
                        province: province[0],
                    });
                }
            }
        }
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

/**
 * List of Provinces Forms & Definitions [Reference]
Similar to the States one I made. I also have no idea what any of these mean, and figured my googling could help others. Definitions from wikipedia.

Barony - the area of land held under the form of feudal land tenure termed feudal barony, or barony by tenure. A feudal baron is a vassal holding a heritable fief called a barony, comprising a specific portion of land, granted by an overlord in return for allegiance and service.

Canton - a type of administrative division of a country. In general, cantons are relatively small in terms of area and population when compared with other administrative divisions such as counties, departments, or provinces.

Council - a group of people who come together to consult, deliberate, or make decisions. A council may function as a legislature, especially at a town, city or county/shire level, but most legislative bodies at the state/provincial or national level are not considered councils. At such levels, there may be no separate executive branch, and the council may effectively represent the entire government.

County - a geographical region of a country used for administrative or other purposes. On the British traditions, counties are usually an administrative division set by convenient geographical demarcations, which in governance have certain officeholders (for example sheriffs and their departments) as a part of the state and provincial mechanisms, including geographically common court systems. A county may be further subdivided into districts, hundreds, townships or other administrative jurisdictions within the county.

Deanery - A deanery (or decanate) is an ecclesiastical (Christian church related) entity. A deanery is either the jurisdiction or residence of a dean.

Department - an administrative or political subdivision in many countries. Departments are the first-level subdivisions of 11 countries, nine in the Americas and two in Africa.

District - a type of administrative division that, in some countries, is managed by local government. Across the world, areas known as "districts" vary greatly in size, spanning regions or counties, several municipalities, subdivisions of municipalities, school district, or political district.

Earldom - An earl is a member of the nobility, akin to the Scandinavian form jarl, and meant "chieftain", particularly a chieftain set to rule a territory in a king's stead.

Governorate - an administrative division of a country. It is headed by a governor.

Land - Each of the lands retain their own governing assembly and statute laws, however many "lands" have no unique administrative function, and are purely geographical. Used in certain parts of Europe

Landgrave - a noble title used in the Holy Roman Empire, and later on in its former territories. The title referred originally to a count who had imperial immediacy, or feudal duty owed directly to the Holy Roman Emperor. His jurisdiction stretched over a sometimes quite considerable territory, which was not subservient to an intermediate power, such as a Duke, a Bishop or Count Palatine. By definition, a landgrave exercised sovereign rights. His decision-making power was comparable to that of a Duke.

Margrave - the medieval title for the military commander assigned to maintain the defence of one of the border provinces of the Holy Roman Empire or of a kingdom. That position became hereditary in certain feudal families in the Empire, and the title came to be borne by rulers of some Imperial principalities until the abolition of the Empire in 1806 (e.g., Margrave of Brandenburg, Margrave of Baden). Thereafter, those domains (originally known as marks or marches, later as margraviates or margravates) were absorbed in larger realms or the titleholders adopted titles indicative of full sovereignty.

Parish - a territorial entity in many Christian denominations, constituting a division within a diocese. A parish is under the pastoral care and clerical jurisdiction of a priest, often termed a parish priest, who might be assisted by one or more curates, and who operates from a parish church. Historically, a parish often covered the same geographical area as a manor.

Prefecture - an administrative jurisdiction or subdivision in any of various countries and within some international church structures, and in antiquity a Roman district governed by an appointed prefect.

Province - an administrative division within a country or state. In some countries with no actual provinces, "the provinces" is a metaphorical term meaning "outside the capital city".

Region - a portion of a country or other region delineated for the purpose of administration. Administrative divisions are granted a certain degree of autonomy and are usually required to manage themselves through their own local governments. Countries are divided up into these smaller units to make managing their land and the affairs of their people easier. A country may be divided into provinces, states, counties, cantons or other sub-units, which, in turn, may be divided in whole or in part into municipalities, counties or others.

Republic - a form of government in which the country is considered a "public matter", not the private concern or property of the rulers. The primary positions of power within a republic are attained, through democracy, oligarchy, autocracy, or a mix thereof, rather than being unalterably occupied. As such it has become the opposing form of government to a monarchy and has therefore no monarch as head of state.

Reservation - EITHER.... a protected area of importance for flora, fauna, or features of geological or other special interest, which is reserved and managed for purposes of conservation and to provide special opportunities for study or research. Nature reserves may be designated by government institutions in some countries, or by private landowners, such as charities, and research institutions.
OR... a legal designation for an area of land managed by a native tribe rather than the governments in which they are physically located.

Shire - a division of land. The shire in early days was governed by an ealdorman and in the later Anglo-Saxon period by royal official known as a "shire reeve" or sheriff. The shires were divided into "hundreds" or "wapentakes", although other less common sub-divisions existed. An alternative name for a shire was a "sheriffdom" until sheriff court reforms separated the two concepts.

State - a state entity that constitutes a part of a sovereign state. A constituent state holds regional jurisdiction over a defined administrative territory, within a sovereign state. Government of a constituent state is a form of regional government.

Territory - an administrative division, usually an area that is under the jurisdiction of a state. In most countries, a territory is an organized division of an area that is controlled by a country but is not formally developed into, or incorporated into, a political unit of the country that is of equal status to other political units that may often be referred to by words such as "provinces" or "states". In international politics, a territory is usually either the total area from which a state may extract power resources or any non-sovereign geographic area which has come under the authority of another government; which has not been granted the powers of self-government normally devolved to secondary territorial divisions; or both.

---(Not in the list)---

Municipality - a single administrative division having corporate status and powers of self-government or jurisdiction as granted by national and regional laws to which it is subordinate. It is to be distinguished (usually) from the county, which may encompass rural territory or numerous small communities such as towns, villages and hamlets.

/**
 * Земли
Дворянские земли
Общие земли
Покинутые земли
Дворянские земли
Столица
Деревня Тоута
Город Раке (на побережье)
Общие земли
Город Кикка
Деревня Ивон 
Город Неан
Город Китен
Город Кекайро
 */
/**
 * 
 * Barony - the area of land held under the form of feudal land tenure termed feudal barony, or barony by tenure. A feudal baron is a vassal holding a heritable fief called a barony, comprising a specific portion of land, granted by an overlord in return for allegiance and service.

Canton - a type of administrative division of a country. In general, cantons are relatively small in terms of area and population when compared with other administrative divisions such as counties, departments, or provinces.

Council - a group of people who come together to consult, deliberate, or make decisions. A council may function as a legislature, especially at a town, city or county/shire level, but most legislative bodies at the state/provincial or national level are not considered councils. At such levels, there may be no separate executive branch, and the council may effectively represent the entire government.

County - a geographical region of a country used for administrative or other purposes. On the British traditions, counties are usually an administrative division set by convenient geographical demarcations, which in governance have certain officeholders (for example sheriffs and their departments) as a part of the state and provincial mechanisms, including geographically common court systems. A county may be further subdivided into districts, hundreds, townships or other administrative jurisdictions within the county.

Deanery - A deanery (or decanate) is an ecclesiastical (Christian church related) entity. A deanery is either the jurisdiction or residence of a dean.

Department - an administrative or political subdivision in many countries. Departments are the first-level subdivisions of 11 countries, nine in the Americas and two in Africa.

District - a type of administrative division that, in some countries, is managed by local government. Across the world, areas known as "districts" vary greatly in size, spanning regions or counties, several municipalities, subdivisions of municipalities, school district, or political district.

Earldom - An earl is a member of the nobility, akin to the Scandinavian form jarl, and meant "chieftain", particularly a chieftain set to rule a territory in a king's stead.

Governorate - an administrative division of a country. It is headed by a governor.

Land - Each of the lands retain their own governing assembly and statute laws, however many "lands" have no unique administrative function, and are purely geographical. Used in certain parts of Europe

Landgrave - a noble title used in the Holy Roman Empire, and later on in its former territories. The title referred originally to a count who had imperial immediacy, or feudal duty owed directly to the Holy Roman Emperor. His jurisdiction stretched over a sometimes quite considerable territory, which was not subservient to an intermediate power, such as a Duke, a Bishop or Count Palatine. By definition, a landgrave exercised sovereign rights. His decision-making power was comparable to that of a Duke.

Margrave - the medieval title for the military commander assigned to maintain the defence of one of the border provinces of the Holy Roman Empire or of a kingdom. That position became hereditary in certain feudal families in the Empire, and the title came to be borne by rulers of some Imperial principalities until the abolition of the Empire in 1806 (e.g., Margrave of Brandenburg, Margrave of Baden). Thereafter, those domains (originally known as marks or marches, later as margraviates or margravates) were absorbed in larger realms or the titleholders adopted titles indicative of full sovereignty.

Parish - a territorial entity in many Christian denominations, constituting a division within a diocese. A parish is under the pastoral care and clerical jurisdiction of a priest, often termed a parish priest, who might be assisted by one or more curates, and who operates from a parish church. Historically, a parish often covered the same geographical area as a manor.

Prefecture - an administrative jurisdiction or subdivision in any of various countries and within some international church structures, and in antiquity a Roman district governed by an appointed prefect.

Province - an administrative division within a country or state. In some countries with no actual provinces, "the provinces" is a metaphorical term meaning "outside the capital city".

Region - a portion of a country or other region delineated for the purpose of administration. Administrative divisions are granted a certain degree of autonomy and are usually required to manage themselves through their own local governments. Countries are divided up into these smaller units to make managing their land and the affairs of their people easier. A country may be divided into provinces, states, counties, cantons or other sub-units, which, in turn, may be divided in whole or in part into municipalities, counties or others.

Republic - a form of government in which the country is considered a "public matter", not the private concern or property of the rulers. The primary positions of power within a republic are attained, through democracy, oligarchy, autocracy, or a mix thereof, rather than being unalterably occupied. As such it has become the opposing form of government to a monarchy and has therefore no monarch as head of state.

Reservation - EITHER.... a protected area of importance for flora, fauna, or features of geological or other special interest, which is reserved and managed for purposes of conservation and to provide special opportunities for study or research. Nature reserves may be designated by government institutions in some countries, or by private landowners, such as charities, and research institutions.
OR... a legal designation for an area of land managed by a native tribe rather than the governments in which they are physically located.

Shire - a division of land. The shire in early days was governed by an ealdorman and in the later Anglo-Saxon period by royal official known as a "shire reeve" or sheriff. The shires were divided into "hundreds" or "wapentakes", although other less common sub-divisions existed. An alternative name for a shire was a "sheriffdom" until sheriff court reforms separated the two concepts.

State - a state entity that constitutes a part of a sovereign state. A constituent state holds regional jurisdiction over a defined administrative territory, within a sovereign state. Government of a constituent state is a form of regional government.

Territory - an administrative division, usually an area that is under the jurisdiction of a state. In most countries, a territory is an organized division of an area that is controlled by a country but is not formally developed into, or incorporated into, a political unit of the country that is of equal status to other political units that may often be referred to by words such as "provinces" or "states". In international politics, a territory is usually either the total area from which a state may extract power resources or any non-sovereign geographic area which has come under the authority of another government; which has not been granted the powers of self-government normally devolved to secondary territorial divisions; or both.

---(Not in the list)---

Municipality - a single administrative division having corporate status and powers of self-government or jurisdiction as granted by national and regional laws to which it is subordinate. It is to be distinguished (usually) from the county, which may encompass rural territory or numerous small communities such as towns, villages and hamlets.
 */
