const art:Record<string,{file:string,alt:string}>={
'she-gave-birth-to-a-dragon':{file:'journal-birth.webp',alt:'A tiny pink dragon claw resting in an open human palm'},
'monstrous-motherhood':{file:'journal-motherhood.webp',alt:'An ivory ribbon cradles an ember among dark thorns'},
'dark-fantasy-gothic-fantasy':{file:'journal-gothic.webp',alt:'A gothic arch opens onto a moonlit forest'},
'why-we-root-for-monsters':{file:'journal-monsters.webp',alt:'A monstrous claw shelters a luminous moth'}
};
export const journalArt=(id:string)=>art[id]??{file:'lore-art.webp',alt:'An open journal by candlelight'};
