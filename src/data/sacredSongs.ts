/**
 * Sacred Songs and Solos — Hymnal Database
 * 
 * A curated collection of popular hymns from the Sacred Songs and Solos hymnal
 * by Ira D. Sankey (public domain).
 */

export interface Hymn {
    number: number;
    title: string;
    author: string;
    verses: string[];
    chorus?: string;
}

export const SACRED_SONGS: Hymn[] = [
    {
        number: 1,
        title: "The Lord Is My Shepherd",
        author: "Joseph Irvine",
        verses: [
            "The Lord is my Shepherd, no want shall I know;\nI feed in green pastures, safe-folded I rest;\nHe leadeth my soul where the still waters flow,\nRestores me when wandering, redeems when oppressed.",
            "Through the valley and shadow of death though I stray,\nSince Thou art my guardian, no evil I fear;\nThy rod shall defend me, Thy staff be my stay;\nNo harm can befall with my Comforter near.",
            "In the midst of affliction my table is spread;\nWith blessings unmeasured my cup runneth o'er;\nWith perfume and oil Thou anointest my head;\nO what shall I ask of Thy providence more?",
            "Let goodness and mercy, my bountiful God,\nStill follow my steps till I meet Thee above;\nI seek, by the path which my forefathers trod,\nThrough the land of their sojourn, Thy kingdom of love."
        ]
    },
    {
        number: 2,
        title: "What a Friend We Have in Jesus",
        author: "Joseph M. Scriven",
        verses: [
            "What a friend we have in Jesus,\nAll our sins and griefs to bear!\nWhat a privilege to carry\nEverything to God in prayer!",
            "Have we trials and temptations?\nIs there trouble anywhere?\nWe should never be discouraged;\nTake it to the Lord in prayer.",
            "Are we weak and heavy laden,\nCumbered with a load of care?\nPrecious Saviour, still our refuge;\nTake it to the Lord in prayer."
        ],
        chorus: "O what peace we often forfeit,\nO what needless pain we bear,\nAll because we do not carry\nEverything to God in prayer!"
    },
    {
        number: 3,
        title: "Amazing Grace",
        author: "John Newton",
        verses: [
            "Amazing grace! how sweet the sound,\nThat saved a wretch like me!\nI once was lost, but now am found,\nWas blind, but now I see.",
            "'Twas grace that taught my heart to fear,\nAnd grace my fears relieved;\nHow precious did that grace appear\nThe hour I first believed!",
            "Through many dangers, toils and snares,\nI have already come;\n'Tis grace hath brought me safe thus far,\nAnd grace will lead me home.",
            "When we've been there ten thousand years,\nBright shining as the sun,\nWe've no less days to sing God's praise\nThan when we first begun."
        ]
    },
    {
        number: 4,
        title: "Rock of Ages",
        author: "Augustus M. Toplady",
        verses: [
            "Rock of Ages, cleft for me,\nLet me hide myself in Thee;\nLet the water and the blood,\nFrom Thy riven side which flowed,\nBe of sin the double cure,\nCleanse me from its guilt and power.",
            "Not the labour of my hands\nCan fulfil Thy law's demands;\nCould my zeal no respite know,\nCould my tears for ever flow,\nAll for sin could not atone;\nThou must save, and Thou alone.",
            "Nothing in my hand I bring,\nSimply to Thy cross I cling;\nNaked, come to Thee for dress;\nHelpless, look to Thee for grace;\nFoul, I to the fountain fly;\nWash me, Saviour, or I die!",
            "While I draw this fleeting breath,\nWhen mine eyes shall close in death,\nWhen I soar to worlds unknown,\nSee Thee on Thy judgment throne,\nRock of Ages, cleft for me,\nLet me hide myself in Thee."
        ]
    },
    {
        number: 5,
        title: "Blessed Assurance",
        author: "Fanny J. Crosby",
        verses: [
            "Blessed assurance, Jesus is mine!\nOh, what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood.",
            "Perfect submission, perfect delight,\nVisions of rapture now burst on my sight;\nAngels descending, bring from above\nEchoes of mercy, whispers of love.",
            "Perfect submission, all is at rest,\nI in my Saviour am happy and blest;\nWatching and waiting, looking above,\nFilled with His goodness, lost in His love."
        ],
        chorus: "This is my story, this is my song,\nPraising my Saviour all the day long;\nThis is my story, this is my song,\nPraising my Saviour all the day long."
    },
    {
        number: 6,
        title: "To God Be the Glory",
        author: "Fanny J. Crosby",
        verses: [
            "To God be the glory, great things He hath done!\nSo loved He the world that He gave us His Son,\nWho yielded His life an atonement for sin,\nAnd opened the Life-gate that all may go in.",
            "O perfect redemption, the purchase of blood!\nTo every believer the promise of God;\nThe vilest offender who truly believes,\nThat moment from Jesus a pardon receives.",
            "Great things He hath taught us, great things He hath done,\nAnd great our rejoicing through Jesus the Son;\nBut purer, and higher, and greater will be\nOur wonder, our transport, when Jesus we see."
        ],
        chorus: "Praise the Lord, praise the Lord,\nLet the earth hear His voice!\nPraise the Lord, praise the Lord,\nLet the people rejoice!\nO come to the Father through Jesus the Son,\nAnd give Him the glory, great things He hath done!"
    },
    {
        number: 7,
        title: "Pass Me Not, O Gentle Saviour",
        author: "Fanny J. Crosby",
        verses: [
            "Pass me not, O gentle Saviour,\nHear my humble cry;\nWhile on others Thou art calling,\nDo not pass me by.",
            "Let me at Thy throne of mercy\nFind a sweet relief;\nKneeling there in deep contrition,\nHelp my unbelief.",
            "Trusting only in Thy merit,\nWould I seek Thy face;\nHeal my wounded, broken spirit,\nSave me by Thy grace.",
            "Thou the Spring of all my comfort,\nMore than life to me;\nWhom have I on earth beside Thee?\nWhom in heaven but Thee?"
        ],
        chorus: "Saviour, Saviour, hear my humble cry;\nWhile on others Thou art calling,\nDo not pass me by."
    },
    {
        number: 8,
        title: "Nearer, My God, to Thee",
        author: "Sarah F. Adams",
        verses: [
            "Nearer, my God, to Thee, nearer to Thee!\nE'en though it be a cross that raiseth me;\nStill all my song shall be,\nNearer, my God, to Thee,\nNearer, my God, to Thee, nearer to Thee!",
            "Though like the wanderer, the sun gone down,\nDarkness be over me, my rest a stone;\nYet in my dreams I'd be\nNearer, my God, to Thee,\nNearer, my God, to Thee, nearer to Thee!",
            "There let the way appear, steps unto heaven;\nAll that Thou sendest me, in mercy given;\nAngels to beckon me\nNearer, my God, to Thee,\nNearer, my God, to Thee, nearer to Thee!",
            "Then, with my waking thoughts bright with Thy praise,\nOut of my stony griefs Bethel I'll raise;\nSo by my woes to be\nNearer, my God, to Thee,\nNearer, my God, to Thee, nearer to Thee!"
        ]
    },
    {
        number: 9,
        title: "Abide with Me",
        author: "Henry F. Lyte",
        verses: [
            "Abide with me; fast falls the eventide;\nThe darkness deepens; Lord, with me abide;\nWhen other helpers fail, and comforts flee,\nHelp of the helpless, O abide with me.",
            "Swift to its close ebbs out life's little day;\nEarth's joys grow dim, its glories pass away;\nChange and decay in all around I see;\nO Thou who changest not, abide with me.",
            "I need Thy presence every passing hour;\nWhat but Thy grace can foil the tempter's power?\nWho like Thyself my guide and stay can be?\nThrough cloud and sunshine, O abide with me.",
            "Hold Thou Thy cross before my closing eyes;\nShine through the gloom, and point me to the skies;\nHeaven's morning breaks, and earth's vain shadows flee;\nIn life, in death, O Lord, abide with me!"
        ]
    },
    {
        number: 10,
        title: "All Hail the Power of Jesus' Name",
        author: "Edward Perronet",
        verses: [
            "All hail the power of Jesus' name!\nLet angels prostrate fall;\nBring forth the royal diadem,\nAnd crown Him Lord of all.",
            "Crown Him, ye martyrs of our God,\nWho from His altar call;\nExtol the Stem of Jesse's rod,\nAnd crown Him Lord of all.",
            "Ye seed of Israel's chosen race,\nYe ransomed of the fall,\nHail Him who saves you by His grace,\nAnd crown Him Lord of all.",
            "Let every kindred, every tribe,\nOn this terrestrial ball,\nTo Him all majesty ascribe,\nAnd crown Him Lord of all."
        ]
    },
    {
        number: 11,
        title: "Stand Up, Stand Up for Jesus",
        author: "George Duffield",
        verses: [
            "Stand up, stand up for Jesus,\nYe soldiers of the cross;\nLift high His royal banner,\nIt must not suffer loss.",
            "Stand up, stand up for Jesus,\nThe trumpet call obey;\nForth to the mighty conflict\nIn this His glorious day.",
            "Stand up, stand up for Jesus,\nStand in His strength alone;\nThe arm of flesh will fail you,\nYe dare not trust your own.",
            "Stand up, stand up for Jesus,\nThe strife will not be long;\nThis day the noise of battle,\nThe next the victor's song."
        ]
    },
    {
        number: 12,
        title: "Just As I Am",
        author: "Charlotte Elliott",
        verses: [
            "Just as I am, without one plea,\nBut that Thy blood was shed for me,\nAnd that Thou bidd'st me come to Thee,\nO Lamb of God, I come! I come!",
            "Just as I am, and waiting not\nTo rid my soul of one dark blot,\nTo Thee, whose blood can cleanse each spot,\nO Lamb of God, I come! I come!",
            "Just as I am, though tossed about\nWith many a conflict, many a doubt,\nFightings and fears within, without,\nO Lamb of God, I come! I come!",
            "Just as I am, poor, wretched, blind;\nSight, riches, healing of the mind,\nYea, all I need, in Thee to find,\nO Lamb of God, I come! I come!"
        ]
    },
    {
        number: 13,
        title: "Great Is Thy Faithfulness",
        author: "Thomas O. Chisholm",
        verses: [
            "Great is Thy faithfulness, O God my Father;\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions they fail not;\nAs Thou hast been Thou forever wilt be.",
            "Summer and winter, and springtime and harvest,\nSun, moon and stars in their courses above;\nJoin with all nature in manifold witness\nTo Thy great faithfulness, mercy and love.",
            "Pardon for sin and a peace that endureth,\nThine own dear presence to cheer and to guide;\nStrength for today and bright hope for tomorrow,\nBlessings all mine, with ten thousand beside!"
        ],
        chorus: "Great is Thy faithfulness!\nGreat is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided;\nGreat is Thy faithfulness, Lord, unto me!"
    },
    {
        number: 14,
        title: "How Great Thou Art",
        author: "Carl Boberg / Stuart K. Hine",
        verses: [
            "O Lord my God! When I in awesome wonder\nConsider all the worlds Thy hands have made,\nI see the stars, I hear the rolling thunder,\nThy power throughout the universe displayed.",
            "When through the woods and forest glades I wander\nAnd hear the birds sing sweetly in the trees;\nWhen I look down from lofty mountain grandeur\nAnd hear the brook and feel the gentle breeze.",
            "And when I think that God, His Son not sparing,\nSent Him to die, I scarce can take it in;\nThat on the cross, my burden gladly bearing,\nHe bled and died to take away my sin.",
            "When Christ shall come with shout of acclamation\nAnd take me home, what joy shall fill my heart!\nThen I shall bow in humble adoration,\nAnd there proclaim, my God, how great Thou art!"
        ],
        chorus: "Then sings my soul, my Saviour God, to Thee:\nHow great Thou art! How great Thou art!\nThen sings my soul, my Saviour God, to Thee:\nHow great Thou art! How great Thou art!"
    },
    {
        number: 15,
        title: "It Is Well with My Soul",
        author: "Horatio G. Spafford",
        verses: [
            "When peace, like a river, attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\nIt is well, it is well with my soul.",
            "Though Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ hath regarded my helpless estate,\nAnd hath shed His own blood for my soul.",
            "My sin — O the bliss of this glorious thought! —\nMy sin, not in part, but the whole,\nIs nailed to the cross, and I bear it no more;\nPraise the Lord, praise the Lord, O my soul!",
            "And, Lord, haste the day when the faith shall be sight,\nThe clouds be rolled back as a scroll;\nThe trump shall resound, and the Lord shall descend;\nEven so, it is well with my soul."
        ],
        chorus: "It is well with my soul,\nIt is well, it is well with my soul."
    },
    {
        number: 16,
        title: "The Old Rugged Cross",
        author: "George Bennard",
        verses: [
            "On a hill far away stood an old rugged cross,\nThe emblem of suffering and shame;\nAnd I love that old cross where the dearest and best\nFor a world of lost sinners was slain.",
            "O that old rugged cross, so despised by the world,\nHas a wondrous attraction for me;\nFor the dear Lamb of God left His glory above\nTo bear it to dark Calvary.",
            "In the old rugged cross, stained with blood so divine,\nA wondrous beauty I see;\nFor 'twas on that old cross Jesus suffered and died\nTo pardon and sanctify me.",
            "To the old rugged cross I will ever be true,\nIts shame and reproach gladly bear;\nThen He'll call me some day to my home far away,\nWhere His glory forever I'll share."
        ],
        chorus: "So I'll cherish the old rugged cross,\nTill my trophies at last I lay down;\nI will cling to the old rugged cross,\nAnd exchange it some day for a crown."
    },
    {
        number: 17,
        title: "Onward, Christian Soldiers",
        author: "Sabine Baring-Gould",
        verses: [
            "Onward, Christian soldiers, marching as to war,\nWith the cross of Jesus going on before!\nChrist, the royal Master, leads against the foe;\nForward into battle, see His banners go!",
            "Like a mighty army moves the Church of God;\nBrothers, we are treading where the saints have trod;\nWe are not divided, all one body we,\nOne in hope and doctrine, one in charity.",
            "Crowns and thrones may perish, kingdoms rise and wane,\nBut the Church of Jesus constant will remain;\nGates of hell can never 'gainst that Church prevail;\nWe have Christ's own promise, and that cannot fail.",
            "Onward, then, ye people, join our happy throng,\nBlend with ours your voices in the triumph song;\nGlory, laud, and honour unto Christ the King;\nThis through countless ages men and angels sing."
        ],
        chorus: "Onward, Christian soldiers, marching as to war,\nWith the cross of Jesus going on before!"
    },
    {
        number: 18,
        title: "I Need Thee Every Hour",
        author: "Annie S. Hawks",
        verses: [
            "I need Thee every hour, most gracious Lord;\nNo tender voice like Thine can peace afford.",
            "I need Thee every hour; stay Thou near by;\nTemptations lose their power when Thou art nigh.",
            "I need Thee every hour, in joy or pain;\nCome quickly and abide, or life is vain.",
            "I need Thee every hour, most Holy One;\nO make me Thine indeed, Thou blessed Son."
        ],
        chorus: "I need Thee, O I need Thee;\nEvery hour I need Thee;\nO bless me now, my Saviour!\nI come to Thee."
    },
    {
        number: 19,
        title: "Holy, Holy, Holy",
        author: "Reginald Heber",
        verses: [
            "Holy, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy! Merciful and mighty!\nGod in three persons, blessed Trinity!",
            "Holy, holy, holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWho wert, and art, and evermore shalt be.",
            "Holy, holy, holy! Though the darkness hide Thee,\nThough the eye of sinful man Thy glory may not see;\nOnly Thou art holy; there is none beside Thee,\nPerfect in power, in love, and purity.",
            "Holy, holy, holy! Lord God Almighty!\nAll Thy works shall praise Thy Name, in earth, and sky, and sea;\nHoly, holy, holy! Merciful and mighty!\nGod in three persons, blessed Trinity!"
        ]
    },
    {
        number: 20,
        title: "Praise, My Soul, the King of Heaven",
        author: "Henry F. Lyte",
        verses: [
            "Praise, my soul, the King of heaven;\nTo His feet thy tribute bring;\nRansomed, healed, restored, forgiven,\nWho like me His praise should sing?\nPraise Him! Praise Him!\nPraise the everlasting King!",
            "Praise Him for His grace and favour\nTo our fathers in distress;\nPraise Him, still the same for ever,\nSlow to chide, and swift to bless.\nPraise Him! Praise Him!\nGlorious in His faithfulness!",
            "Father-like He tends and spares us;\nWell our feeble frame He knows;\nIn His hands He gently bears us,\nRescues us from all our foes.\nPraise Him! Praise Him!\nWidely as His mercy flows!",
            "Angels help us to adore Him;\nYe behold Him face to face;\nSun and moon, bow down before Him;\nDwellers all in time and space.\nPraise Him! Praise Him!\nPraise with us the God of grace!"
        ]
    },
    {
        number: 21,
        title: "O Come, All Ye Faithful",
        author: "John F. Wade",
        verses: [
            "O come, all ye faithful, joyful and triumphant,\nO come ye, O come ye to Bethlehem;\nCome and behold Him, born the King of angels.",
            "God of God, Light of Light,\nLo! He abhors not the Virgin's womb;\nVery God, begotten, not created.",
            "Sing, choirs of angels, sing in exultation,\nSing, all ye citizens of heaven above;\nGlory to God, in the highest.",
            "Yea, Lord, we greet Thee, born this happy morning,\nJesu, to Thee be glory given;\nWord of the Father, now in flesh appearing."
        ],
        chorus: "O come, let us adore Him,\nO come, let us adore Him,\nO come, let us adore Him, Christ the Lord!"
    },
    {
        number: 22,
        title: "When I Survey the Wondrous Cross",
        author: "Isaac Watts",
        verses: [
            "When I survey the wondrous cross\nOn which the Prince of glory died,\nMy richest gain I count but loss,\nAnd pour contempt on all my pride.",
            "Forbid it, Lord, that I should boast,\nSave in the death of Christ my God;\nAll the vain things that charm me most,\nI sacrifice them to His blood.",
            "See, from His head, His hands, His feet,\nSorrow and love flow mingled down;\nDid e'er such love and sorrow meet,\nOr thorns compose so rich a crown?",
            "Were the whole realm of nature mine,\nThat were an offering far too small;\nLove so amazing, so divine,\nDemands my soul, my life, my all."
        ]
    },
    {
        number: 23,
        title: "Saviour, Like a Shepherd Lead Us",
        author: "Dorothy A. Thrupp",
        verses: [
            "Saviour, like a Shepherd lead us,\nMuch we need Thy tender care;\nIn Thy pleasant pastures feed us,\nFor our use Thy folds prepare:\nBlessed Jesus, blessed Jesus,\nThou hast bought us, Thine we are.",
            "We are Thine; do Thou befriend us,\nBe the Guardian of our way;\nKeep Thy flock, from sin defend us,\nSeek us when we go astray:\nBlessed Jesus, blessed Jesus,\nHear the children when they pray.",
            "Thou hast promised to receive us,\nPoor and sinful though we be;\nThou hast mercy to relieve us,\nGrace to cleanse, and power to free:\nBlessed Jesus, blessed Jesus,\nEarly let us turn to Thee.",
            "Early let us seek Thy favour,\nEarly let us do Thy will;\nBlessed Lord and only Saviour,\nWith Thy love our bosoms fill:\nBlessed Jesus, blessed Jesus,\nThou hast loved us, love us still."
        ]
    },
    {
        number: 24,
        title: "The Blood Will Never Lose Its Power",
        author: "Andraé Crouch",
        verses: [
            "The blood that Jesus shed for me,\nWay back on Calvary;\nThe blood that gives me strength from day to day,\nIt will never lose its power.",
            "It reaches to the highest mountain,\nIt flows to the lowest valley;\nThe blood that gives me strength from day to day,\nIt will never lose its power."
        ],
        chorus: "It reaches to the highest mountain,\nIt flows to the lowest valley;\nThe blood that gives me strength from day to day,\nIt will never lose its power."
    },
    {
        number: 25,
        title: "Sweet Hour of Prayer",
        author: "William W. Walford",
        verses: [
            "Sweet hour of prayer, sweet hour of prayer,\nThat calls me from a world of care,\nAnd bids me at my Father's throne\nMake all my wants and wishes known;\nIn seasons of distress and grief\nMy soul has often found relief,\nAnd oft escaped the tempter's snare\nBy thy return, sweet hour of prayer.",
            "Sweet hour of prayer, sweet hour of prayer,\nThy wings shall my petition bear\nTo Him whose truth and faithfulness\nEngage the waiting soul to bless;\nAnd since He bids me seek His face,\nBelieve His Word, and trust His grace,\nI'll cast on Him my every care,\nAnd wait for thee, sweet hour of prayer."
        ]
    },
    {
        number: 26,
        title: "Jesus Loves Me",
        author: "Anna B. Warner",
        verses: [
            "Jesus loves me! This I know,\nFor the Bible tells me so;\nLittle ones to Him belong;\nThey are weak, but He is strong.",
            "Jesus loves me! He who died\nHeaven's gate to open wide;\nHe will wash away my sin,\nLet His little child come in.",
            "Jesus loves me! He will stay\nClose beside me all the way;\nThou hast bled and died for me,\nI will henceforth live for Thee."
        ],
        chorus: "Yes, Jesus loves me!\nYes, Jesus loves me!\nYes, Jesus loves me!\nThe Bible tells me so."
    },
    {
        number: 27,
        title: "O Happy Day",
        author: "Philip Doddridge",
        verses: [
            "O happy day that fixed my choice\nOn Thee, my Saviour and my God!\nWell may this glowing heart rejoice,\nAnd tell its raptures all abroad.",
            "'Tis done, the great transaction's done;\nI am my Lord's, and He is mine;\nHe drew me, and I followed on,\nCharmed to confess the voice divine.",
            "Now rest, my long divided heart;\nFixed on this blissful centre, rest;\nNor ever from thy Lord depart,\nWith Him of every good possessed."
        ],
        chorus: "O happy day, O happy day,\nWhen Jesus washed my sins away!\nHe taught me how to watch and pray,\nAnd live rejoicing every day;\nO happy day, O happy day,\nWhen Jesus washed my sins away."
    },
    {
        number: 28,
        title: "Come, Thou Fount of Every Blessing",
        author: "Robert Robinson",
        verses: [
            "Come, Thou Fount of every blessing,\nTune my heart to sing Thy grace;\nStreams of mercy, never ceasing,\nCall for songs of loudest praise.",
            "Here I raise mine Ebenezer;\nHither by Thy help I'm come;\nAnd I hope, by Thy good pleasure,\nSafely to arrive at home.",
            "O to grace how great a debtor\nDaily I'm constrained to be!\nLet Thy goodness, like a fetter,\nBind my wandering heart to Thee."
        ]
    },
    {
        number: 29,
        title: "Leaning on the Everlasting Arms",
        author: "Elisha A. Hoffman",
        verses: [
            "What a fellowship, what a joy divine,\nLeaning on the everlasting arms;\nWhat a blessedness, what a peace is mine,\nLeaning on the everlasting arms.",
            "O how sweet to walk in this pilgrim way,\nLeaning on the everlasting arms;\nO how bright the path grows from day to day,\nLeaning on the everlasting arms.",
            "What have I to dread, what have I to fear,\nLeaning on the everlasting arms?\nI have blessed peace with my Lord so near,\nLeaning on the everlasting arms."
        ],
        chorus: "Leaning, leaning, safe and secure from all alarms;\nLeaning, leaning, leaning on the everlasting arms."
    },
    {
        number: 30,
        title: "My Faith Looks Up to Thee",
        author: "Ray Palmer",
        verses: [
            "My faith looks up to Thee,\nThou Lamb of Calvary, Saviour divine;\nNow hear me while I pray,\nTake all my guilt away,\nO let me from this day be wholly Thine!",
            "May Thy rich grace impart\nStrength to my fainting heart, my zeal inspire;\nAs Thou hast died for me,\nO may my love to Thee\nPure, warm, and changeless be, a living fire!",
            "While life's dark maze I tread,\nAnd griefs around me spread, be Thou my guide;\nBid darkness turn to day,\nWipe sorrow's tears away,\nNor let me ever stray from Thee aside."
        ]
    },
    {
        number: 31,
        title: "A Mighty Fortress Is Our God",
        author: "Martin Luther",
        verses: [
            "A mighty fortress is our God,\nA bulwark never failing;\nOur helper He amid the flood\nOf mortal ills prevailing.",
            "Did we in our own strength confide,\nOur striving would be losing;\nWere not the right man on our side,\nThe man of God's own choosing.",
            "And though this world, with devils filled,\nShould threaten to undo us,\nWe will not fear, for God hath willed\nHis truth to triumph through us.",
            "That word above all earthly power —\nNo thanks to them — abideth;\nThe Spirit and the gifts are ours\nThrough Him who with us sideth."
        ]
    },
    {
        number: 32,
        title: "Take My Life, and Let It Be",
        author: "Frances R. Havergal",
        verses: [
            "Take my life, and let it be\nConsecrated, Lord, to Thee;\nTake my moments and my days,\nLet them flow in ceaseless praise.",
            "Take my hands, and let them move\nAt the impulse of Thy love;\nTake my feet, and let them be\nSwift and beautiful for Thee.",
            "Take my voice, and let me sing\nAlways, only, for my King;\nTake my lips, and let them be\nFilled with messages from Thee.",
            "Take my will, and make it Thine;\nIt shall be no longer mine;\nTake my heart, it is Thine own;\nIt shall be Thy royal throne."
        ]
    },
    {
        number: 33,
        title: "Trust and Obey",
        author: "John H. Sammis",
        verses: [
            "When we walk with the Lord in the light of His Word,\nWhat a glory He sheds on our way!\nWhile we do His good will, He abides with us still,\nAnd with all who will trust and obey.",
            "Not a shadow can rise, not a cloud in the skies,\nBut His smile quickly drives it away;\nNot a doubt or a fear, not a sigh or a tear,\nCan abide while we trust and obey.",
            "Not a burden we bear, not a sorrow we share,\nBut our toil He doth richly repay;\nNot a grief or a loss, not a frown or a cross,\nBut is blest if we trust and obey.",
            "Then in fellowship sweet we will sit at His feet,\nOr we'll walk by His side in the way;\nWhat He says we will do, where He sends we will go;\nNever fear, only trust and obey."
        ],
        chorus: "Trust and obey, for there's no other way\nTo be happy in Jesus, but to trust and obey."
    },
    {
        number: 34,
        title: "I Surrender All",
        author: "Judson W. Van DeVenter",
        verses: [
            "All to Jesus I surrender, all to Him I freely give;\nI will ever love and trust Him, in His presence daily live.",
            "All to Jesus I surrender, humbly at His feet I bow;\nWorldly pleasures all forsaken, take me, Jesus, take me now.",
            "All to Jesus I surrender, make me, Saviour, wholly Thine;\nLet me feel the Holy Spirit, truly know that Thou art mine.",
            "All to Jesus I surrender, Lord, I give myself to Thee;\nFill me with Thy love and power, let Thy blessing fall on me."
        ],
        chorus: "I surrender all, I surrender all;\nAll to Thee, my blessed Saviour,\nI surrender all."
    },
    {
        number: 35,
        title: "Love Divine, All Loves Excelling",
        author: "Charles Wesley",
        verses: [
            "Love divine, all loves excelling,\nJoy of heaven, to earth come down;\nFix in us Thy humble dwelling,\nAll Thy faithful mercies crown.",
            "Breathe, O breathe Thy loving Spirit\nInto every troubled breast;\nLet us all in Thee inherit,\nLet us find the promised rest.",
            "Come, Almighty to deliver,\nLet us all Thy life receive;\nSuddenly return, and never,\nNever more Thy temples leave.",
            "Finish, then, Thy new creation;\nPure and spotless let us be;\nLet us see Thy great salvation\nPerfectly restored in Thee."
        ]
    },
    {
        number: 36,
        title: "Softly and Tenderly Jesus Is Calling",
        author: "Will L. Thompson",
        verses: [
            "Softly and tenderly Jesus is calling,\nCalling for you and for me;\nSee, on the portals He's waiting and watching,\nWatching for you and for me.",
            "Why should we tarry when Jesus is pleading,\nPleading for you and for me?\nWhy should we linger and heed not His mercies,\nMercies for you and for me?",
            "Time is now fleeting, the moments are passing,\nPassing from you and from me;\nShadows are gathering, death-beds are coming,\nComing for you and for me.",
            "O for the wonderful love He has promised,\nPromised for you and for me!\nThough we have sinned, He has mercy and pardon,\nPardon for you and for me."
        ],
        chorus: "Come home, come home;\nYe who are weary, come home;\nEarnestly, tenderly, Jesus is calling,\nCalling, O sinner, come home!"
    },
    {
        number: 37,
        title: "Lead, Kindly Light",
        author: "John H. Newman",
        verses: [
            "Lead, kindly light, amid the encircling gloom,\nLead Thou me on!\nThe night is dark, and I am far from home —\nLead Thou me on!\nKeep Thou my feet; I do not ask to see\nThe distant scene — one step enough for me.",
            "I was not ever thus, nor prayed that Thou\nShouldst lead me on;\nI loved to choose and see my path, but now\nLead Thou me on!\nI loved the garish day, and, spite of fears,\nPride ruled my will: remember not past years.",
            "So long Thy power hath blest me, sure it still\nWill lead me on;\nO'er moor and fen, o'er crag and torrent, till\nThe night is gone;\nAnd with the morn those angel faces smile\nWhich I have loved long since, and lost awhile."
        ]
    },
    {
        number: 38,
        title: "Blessed Be the Name",
        author: "William H. Clark",
        verses: [
            "All praise to Him who reigns above\nIn majesty supreme,\nWho gave His Son for man to die,\nThat He might man redeem!",
            "His name above all names shall stand,\nExalted more and more,\nAt God the Father's own right hand,\nWhere angel hosts adore.",
            "Redeemer, Saviour, Friend of man\nOnce ruined by the fall,\nThou hast devised salvation's plan,\nFor Thou hast died for all.",
            "His name shall be the Counsellor,\nThe mighty Prince of Peace,\nOf all earth's kingdoms Conqueror,\nWhose reign shall never cease."
        ],
        chorus: "Blessed be the name, blessed be the name,\nBlessed be the name of the Lord!\nBlessed be the name, blessed be the name,\nBlessed be the name of the Lord!"
    },
    {
        number: 39,
        title: "Guide Me, O Thou Great Jehovah",
        author: "William Williams",
        verses: [
            "Guide me, O Thou great Jehovah,\nPilgrim through this barren land;\nI am weak, but Thou art mighty;\nHold me with Thy powerful hand;\nBread of heaven, bread of heaven,\nFeed me till I want no more.",
            "Open now the crystal fountain\nWhence the healing stream doth flow;\nLet the fire and cloudy pillar\nLead me all my journey through;\nStrong Deliverer, strong Deliverer,\nBe Thou still my strength and shield.",
            "When I tread the verge of Jordan,\nBid my anxious fears subside;\nDeath of death, and hell's Destruction,\nLand me safe on Canaan's side;\nSongs of praises, songs of praises,\nI will ever give to Thee."
        ]
    },
    {
        number: 40,
        title: "My Hope Is Built on Nothing Less",
        author: "Edward Mote",
        verses: [
            "My hope is built on nothing less\nThan Jesus' blood and righteousness;\nI dare not trust the sweetest frame,\nBut wholly lean on Jesus' name.",
            "When darkness veils His lovely face,\nI rest on His unchanging grace;\nIn every high and stormy gale,\nMy anchor holds within the veil.",
            "His oath, His covenant, His blood\nSupport me in the 'whelming flood;\nWhen all around my soul gives way,\nHe then is all my hope and stay.",
            "When He shall come with trumpet sound,\nO may I then in Him be found;\nDressed in His righteousness alone,\nFaultless to stand before the throne."
        ],
        chorus: "On Christ, the solid Rock, I stand;\nAll other ground is sinking sand,\nAll other ground is sinking sand."
    },
    {
        number: 41,
        title: "Count Your Blessings",
        author: "Johnson Oatman Jr.",
        verses: [
            "When upon life's billows you are tempest tossed,\nWhen you are discouraged, thinking all is lost,\nCount your many blessings, name them one by one,\nAnd it will surprise you what the Lord hath done.",
            "Are you ever burdened with a load of care?\nDoes the cross seem heavy you are called to bear?\nCount your many blessings, every doubt will fly,\nAnd you will be singing as the days go by.",
            "When you look at others with their lands and gold,\nThink that Christ has promised you His wealth untold;\nCount your many blessings, money cannot buy\nYour reward in heaven, nor your home on high.",
            "So, amid the conflict, whether great or small,\nDo not be discouraged, God is over all;\nCount your many blessings, angels will attend,\nHelp and comfort give you to your journey's end."
        ],
        chorus: "Count your blessings, name them one by one;\nCount your blessings, see what God hath done;\nCount your blessings, name them one by one;\nCount your many blessings, see what God hath done."
    },
    {
        number: 42,
        title: "O God, Our Help in Ages Past",
        author: "Isaac Watts",
        verses: [
            "O God, our help in ages past,\nOur hope for years to come,\nOur shelter from the stormy blast,\nAnd our eternal home.",
            "Under the shadow of Thy throne\nThy saints have dwelt secure;\nSufficient is Thine arm alone,\nAnd our defence is sure.",
            "Before the hills in order stood,\nOr earth received her frame,\nFrom everlasting Thou art God,\nTo endless years the same.",
            "O God, our help in ages past,\nOur hope for years to come,\nBe Thou our guard while troubles last,\nAnd our eternal home."
        ]
    },
    {
        number: 43,
        title: "Blessed Be the Tie That Binds",
        author: "John Fawcett",
        verses: [
            "Blest be the tie that binds\nOur hearts in Christian love;\nThe fellowship of kindred minds\nIs like to that above.",
            "Before our Father's throne\nWe pour our ardent prayers;\nOur fears, our hopes, our aims are one,\nOur comforts and our cares.",
            "We share our mutual woes,\nOur mutual burdens bear;\nAnd often for each other flows\nThe sympathising tear.",
            "When we asunder part\nIt gives us inward pain;\nBut we shall still be joined in heart,\nAnd hope to meet again."
        ]
    },
    {
        number: 44,
        title: "Jesus Paid It All",
        author: "Elvina M. Hall",
        verses: [
            "I hear the Saviour say,\nThy strength indeed is small;\nChild of weakness, watch and pray,\nFind in Me thine all in all.",
            "Lord, now indeed I find\nThy power, and Thine alone,\nCan change the leper's spots,\nAnd melt the heart of stone.",
            "For nothing good have I\nWhereby Thy grace to claim;\nI'll wash my garments white\nIn the blood of Calvary's Lamb.",
            "And when before the throne\nI stand in Him complete,\nJesus died my soul to save,\nMy lips shall still repeat."
        ],
        chorus: "Jesus paid it all, all to Him I owe;\nSin had left a crimson stain,\nHe washed it white as snow."
    },
    {
        number: 45,
        title: "There Is Power in the Blood",
        author: "Lewis E. Jones",
        verses: [
            "Would you be free from the burden of sin?\nThere's power in the blood, power in the blood;\nWould you o'er evil a victory win?\nThere's wonderful power in the blood.",
            "Would you be free from your passion and pride?\nThere's power in the blood, power in the blood;\nCome for a cleansing to Calvary's tide;\nThere's wonderful power in the blood.",
            "Would you be whiter, much whiter than snow?\nThere's power in the blood, power in the blood;\nSin stains are lost in its life-giving flow;\nThere's wonderful power in the blood.",
            "Would you do service for Jesus your King?\nThere's power in the blood, power in the blood;\nWould you live daily His praises to sing?\nThere's wonderful power in the blood."
        ],
        chorus: "There is power, power, wonder-working power\nIn the blood of the Lamb;\nThere is power, power, wonder-working power\nIn the precious blood of the Lamb."
    },
    {
        number: 46,
        title: "Whiter Than Snow",
        author: "James Nicholson",
        verses: [
            "Lord Jesus, I long to be perfectly whole;\nI want Thee forever to live in my soul;\nBreak down every idol, cast out every foe;\nNow wash me, and I shall be whiter than snow.",
            "Lord Jesus, look down from Thy throne in the skies,\nAnd help me to make a complete sacrifice;\nI give up myself, and whatever I know —\nNow wash me, and I shall be whiter than snow.",
            "Lord Jesus, for this I most humbly entreat;\nI wait, blessed Lord, at Thy crucified feet;\nBy faith, for my cleansing I see Thy blood flow —\nNow wash me, and I shall be whiter than snow.",
            "Lord Jesus, Thou seest I patiently wait;\nCome now, and within me a new heart create;\nTo those who have sought Thee, Thou never saidst no —\nNow wash me, and I shall be whiter than snow."
        ],
        chorus: "Whiter than snow, yes, whiter than snow;\nNow wash me, and I shall be whiter than snow."
    },
    {
        number: 47,
        title: "Nothing but the Blood of Jesus",
        author: "Robert Lowry",
        verses: [
            "What can wash away my sin?\nNothing but the blood of Jesus;\nWhat can make me whole again?\nNothing but the blood of Jesus.",
            "For my pardon this I see —\nNothing but the blood of Jesus;\nFor my cleansing this my plea —\nNothing but the blood of Jesus.",
            "Nothing can for sin atone —\nNothing but the blood of Jesus;\nNaught of good that I have done —\nNothing but the blood of Jesus.",
            "This is all my hope and peace —\nNothing but the blood of Jesus;\nThis is all my righteousness —\nNothing but the blood of Jesus."
        ],
        chorus: "O precious is the flow\nThat makes me white as snow;\nNo other fount I know,\nNothing but the blood of Jesus."
    },
    {
        number: 48,
        title: "Rescue the Perishing",
        author: "Fanny J. Crosby",
        verses: [
            "Rescue the perishing, care for the dying,\nSnatch them in pity from sin and the grave;\nWeep o'er the erring one, lift up the fallen,\nTell them of Jesus, the mighty to save.",
            "Though they are slighting Him, still He is waiting,\nWaiting the penitent child to receive;\nPlead with them earnestly, plead with them gently;\nHe will forgive if they only believe.",
            "Down in the human heart, crushed by the tempter,\nFeelings lie buried that grace can restore;\nTouched by a loving heart, wakened by kindness,\nChords that are broken will vibrate once more.",
            "Rescue the perishing, duty demands it;\nStrength for thy labour the Lord will provide;\nBack to the narrow way patiently win them;\nTell the poor wanderer a Saviour has died."
        ],
        chorus: "Rescue the perishing, care for the dying;\nJesus is merciful, Jesus will save."
    },
    {
        number: 49,
        title: "Joyful, Joyful, We Adore Thee",
        author: "Henry van Dyke",
        verses: [
            "Joyful, joyful, we adore Thee,\nGod of glory, Lord of love;\nHearts unfold like flowers before Thee,\nOpening to the sun above.",
            "All Thy works with joy surround Thee,\nEarth and heaven reflect Thy rays,\nStars and angels sing around Thee,\nCentre of unbroken praise.",
            "Thou art giving and forgiving,\nEver blessing, ever blest,\nWell-spring of the joy of living,\nOcean-depth of happy rest!",
            "Mortals, join the mighty chorus\nWhich the morning stars began;\nFather love is reigning o'er us,\nBrother love binds man to man."
        ]
    },
    {
        number: 50,
        title: "Beneath the Cross of Jesus",
        author: "Elizabeth C. Clephane",
        verses: [
            "Beneath the cross of Jesus\nI fain would take my stand,\nThe shadow of a mighty rock\nWithin a weary land;\nA home within the wilderness,\nA rest upon the way,\nFrom the burning of the noontide heat,\nAnd the burden of the day.",
            "Upon the cross of Jesus\nMine eye at times can see\nThe very dying form of One\nWho suffered there for me;\nAnd from my stricken heart with tears\nTwo wonders I confess:\nThe wonders of redeeming love\nAnd my unworthiness.",
            "I take, O cross, thy shadow\nFor my abiding place;\nI ask no other sunshine than\nThe sunshine of His face;\nContent to let the world go by,\nTo know no gain or loss,\nMy sinful self my only shame,\nMy glory all the cross."
        ]
    }
];

/**
 * Search hymns by number, title, or lyrics content
 */
export function searchHymns(query: string): Hymn[] {
    const q = query.toLowerCase().trim();

    // Search by number
    const num = parseInt(q, 10);
    if (!isNaN(num)) {
        const exact = SACRED_SONGS.find(h => h.number === num);
        return exact ? [exact] : [];
    }

    // Search by title or lyrics
    return SACRED_SONGS.filter(h => {
        if (h.title.toLowerCase().includes(q)) return true;
        if (h.author.toLowerCase().includes(q)) return true;
        if (h.chorus?.toLowerCase().includes(q)) return true;
        return h.verses.some(v => v.toLowerCase().includes(q));
    });
}

/**
 * Get a hymn by its number
 */
export function getHymnByNumber(num: number): Hymn | undefined {
    return SACRED_SONGS.find(h => h.number === num);
}

/**
 * Extract hymn number from voice command
 * Matches patterns like "hymn 23", "song 15", "sacred song 8"
 */
export function extractHymnNumber(text: string): number | null {
    const patterns = [
        /(?:hymn|song|sacred song|sacred songs?(?:\s+and\s+solos?)?)\s*(?:number\s*)?(\d+)/i,
        /(?:number|no\.?|#)\s*(\d+)\s*(?:hymn|song)?/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) return parseInt(match[1], 10);
    }
    return null;
}

/**
 * Check if text is requesting a hymn
 */
export function isHymnRequest(text: string): boolean {
    const q = text.toLowerCase().trim();
    return /\b(hymn|sacred song|sacred songs?\s+and\s+solos?|sing|song\s+\d+|hymn\s+\d+)\b/i.test(q);
}
