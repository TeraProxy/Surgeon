// Version 0.5.1b
// contains code from shape-changer by Spaacecats https://github.com/spaacecats
// contains code from relog by wuaw https://github.com/wuaw

const path = require('path'),
	fs = require('fs'),
    Command = require('command')

const HEAD_ID = 7000001,
	GROW_ID = 7000005,
	THIGH_ID = 7000014,
	CHEST_ID = 7000012,
	MARROW_ID = 999001038,
	LACHE_ID = 97000032,
	MI_ID = 903,
	DCHILL_ID = 91101300,
	DFIRE_ID = 91100200,
	MIWINGS_ID = 3000,
	DARKAN_ID = 97950009,
	RAG_ID  = 10155130,
	REAP_ID = 10151010,
	NOCT_ID = 920

module.exports = function Surgeon(dispatch) {
    
	let cid = null,
		player = '',
		model = -1,
		logininfo = null,
		race = -1,
		gender = -1,
		genderforchange = -1,
		job = -1,
		
		newlogininfo = null,
		
		changeme = false,
		newrace = -1,
		newgender = -1,
		newappearance = '',
		newdetails = '',
		newdetails2 = '',
		inRaceChange = false,
		inGenderChange = false,
		inAppearanceChange = false,
		imnotmyself = false,
		
		stack = 4,
		timeout = null,
		headstate = false,
		marrowstate = false,
		lachestate = false,
		miwingstate = false,
		mistate = false,
		chillstate = false,
		firestate = false,
		darkanstate = false,
		ragstate = false,
		reapstate = false,
		noctstate = false,
        
        customApp = [],
        forced,
        forcedVal,
        currJob
    
    try {
		customApp = require('./app.json')
	}
	catch(e) {}

	// ############# //
	// ### Magic ### //
	// ############# //
	
	dispatch.hook('S_LOGIN', 2, event => {
        let index = customApp.findIndex(x => x.name == event.name);
        
        if(forced && player == event.name){
			let app = customApp[forcedVal].app.toString(),
				details = customApp[forcedVal].details,
				details2 = customApp[forcedVal].details2
            event.appearance = require('long').fromString(app);
            event.model = getModel(customApp[forcedVal].race, customApp[forcedVal].gender, currJob)
			event.details = Buffer.from(details, 'hex')
			event.details2 = Buffer.from(details2, 'hex')
        }
        else if(index != -1){
			let app = customApp[index].app.toString(),
				details = customApp[index].details,
				details2 = customApp[index].details2
            event.appearance = require('long').fromString(app);
            event.model = getModel(customApp[index].race, customApp[index].gender, customApp[index].job)
			event.details = Buffer.from(details, 'hex')
			event.details2 = Buffer.from(details2, 'hex')
        }

		if(changeme && player == event.name) { 
			event.appearance = require('long').fromString(newappearance)
			event.model = getModel(newrace, newgender, job)
			event.details = Buffer.from(newdetails, 'hex')
			event.details2 = Buffer.from(newdetails2, 'hex')
		}
		
		({cid, model} = event)
		player = event.name
		
		logininfo = event
		
		race = Math.floor((model - 100) / 200 % 50) // 0 Human, 1 High Elf, 2 Aman, 3 Castanic, 4 Popori/Elin, 5 Baraka
		gender = Math.floor(model / 100 % 2) + 1 // 1 female, 2 male
		job = model % 100 - 1 // 0 Warrior, 1 Lancer, [...], 12 Valkyrie
		if(gender == 1) genderforchange = 1
		else genderforchange = 0
		
		inRaceChange = false
		inGenderChange = false
		inAppearanceChange = false
		
		timeout = null
		headstate = false
		marrowstate = false
		lachestate = false
		miwingstate = false
		mistate = false
		chillstate = false
		firestate = false
		darkanstate = false
		ragstate = false
		reapstate = false
		noctstate = false
        
        if(forced || index != -1) return true;
		
		if(changeme) { 
			changeme = false
			return true
		}
	})
	
	dispatch.hook('C_CANCEL_CHANGE_USER_APPEARANCE', 1, event => {
		if(inRaceChange) {
			inRaceChange = false
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 0,
				unk: 0
			})
			relogByName(player)
			return false
		}
		else if(inGenderChange) {
			inGenderChange = false
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 0,
				unk: 0
			})
			relogByName(player)
			return false
		}
		else if(inAppearanceChange) {
			inAppearanceChange = false
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 0,
				unk: 0
			})
			relogByName(player)
			return false
		}
	})
	
	dispatch.hook('C_COMMIT_CHANGE_USER_APPEARANCE', 1, event => {
		if(inRaceChange) {
			inRaceChange = false
			newrace = event.race
			if(event.gender == 0) newgender = 2
			else newgender = event.gender
			newappearance = event.appearance.toString()
			newdetails = event.details.toString('hex')
			newdetails2 = event.details2.toString('hex')
			imnotmyself = true
			changeme = true
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 1,
				unk: 0
			})
                customApp.push({
                name: player,
                race: newrace,
                gender: event.gender,
                job: job,
                app: newappearance,
				details: newdetails,
				details2: newdetails2
                })
                saveCustom();
            
			relogByName(player)
			return false
		}
		else if(inGenderChange) {
			inGenderChange = false
			newrace = event.race
			if(event.gender == 0) newgender = 2
			else newgender = event.gender
			newappearance = event.appearance.toString()
			newdetails = event.details.toString('hex')
			newdetails2 = event.details2.toString('hex')
			imnotmyself = true
			changeme = true
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 1,
				unk: 0
			})
                customApp.push({
                name: player,
                race: newrace,
                gender: event.gender,
                job: job,
                app: newappearance,
				details: newdetails,
				details2: newdetails2
                })
                saveCustom();
            
			relogByName(player)
			return false
		}
		else if(inAppearanceChange) {
			inAppearanceChange = false
			newrace = event.race
			if(event.gender == 0) newgender = 2
			else newgender = event.gender
			newappearance = event.appearance.toString()
			newdetails = event.details.toString('hex')
			newdetails2 = event.details2.toString('hex')
			imnotmyself = true
			changeme = true
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 1,
				unk: 0
			})
                customApp.push({
                name: player,
                race: newrace,
                gender: event.gender,
                job: job,
                app: newappearance,
				details: newdetails,
				details2: newdetails2
                })
                saveCustom();
            
			relogByName(player)
			return false
		}
	})
	
	dispatch.hook('C_REVIVE_NOW', 1, (event) => {
		timeout = setTimeout(restoreEffect, 3000)
	})
	
	// ######################## //
	// ### Helper Functions ### //
	// ######################## //
	
	function raceChange() {
		dispatch.toClient('S_START_CHANGE_USER_APPEARANCE', 1, {
			type: 1,
			playerId: logininfo.playerId,
			gender: genderforchange,
			race: race,
			class: job,
			weapon: logininfo.weapon,
			earring1: 0,
			earring2: 0,
			chest: logininfo.chest,
			gloves: logininfo.gloves,
			boots: logininfo.boots,
			unk0: 0,
			ring1: 0,
			ring2: 0,
			innerwear: logininfo.innerwear,
			appearance: require('long').fromString(logininfo.appearance.toString()),
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: 0,
			unk5: 0,
			unk6: 0,
			unk7: 0,
			unk8: 0,
			unk9: 0,
			unk10: 0,
			unk11: 0,
			unk12: 0,
			unk13: 0,
			unk14: 0,
			unk15: 0,
			unk16: 0,
			unk17: 0,
			unk18: 0,
			unk19: 0,
			unk20: 0,
			unk21: 0,
			unk22: 0,
			unk23: 0,
			unk24: logininfo.weaponEnchantment, // enchantment
			unk25: 100,
			item: 168011, // Race Change Voucher
			details: Buffer.from(logininfo.details.toString('hex'), 'hex'),
			details2: Buffer.from(logininfo.details2.toString('hex'), 'hex')
		})
		inRaceChange = true
	}
	
	function genderChange() {
		if(race == 4 || race == 5) {
			message('You cannot change the gender of your race')
			return
		}
		dispatch.toClient('S_START_CHANGE_USER_APPEARANCE', 1, {
			type: 2,
			playerId: logininfo.playerId,
			gender: genderforchange,
			race: race,
			class: job,
			weapon: logininfo.weapon,
			earring1: 0,
			earring2: 0,
			chest: logininfo.chest,
			gloves: logininfo.gloves,
			boots: logininfo.boots,
			unk0: 0,
			ring1: 0,
			ring2: 0,
			innerwear: logininfo.innerwear,
			appearance: require('long').fromString(logininfo.appearance.toString()),
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: 0,
			unk5: 0,
			unk6: 0,
			unk7: 0,
			unk8: 0,
			unk9: 0,
			unk10: 0,
			unk11: 0,
			unk12: 0,
			unk13: 0,
			unk14: 0,
			unk15: 0,
			unk16: 0,
			unk17: 0,
			unk18: 0,
			unk19: 0,
			unk20: 0,
			unk21: 0,
			unk22: 0,
			unk23: 0,
			unk24: logininfo.weaponEnchantment, // enchantment
			unk25: 100,
			item: 168012, // Gender Change Voucher
			details: Buffer.from(logininfo.details.toString('hex'), 'hex'),
			details2: Buffer.from(logininfo.details2.toString('hex'), 'hex')
		})
		inGenderChange = true
	}
	
	function appearanceChange() {
		dispatch.toClient('S_START_CHANGE_USER_APPEARANCE', 1, {
			type: 3,
			playerId: logininfo.playerId,
			gender: genderforchange,
			race: race,
			class: job,
			weapon: logininfo.weapon,
			earring1: 0,
			earring2: 0,
			chest: logininfo.chest,
			gloves: logininfo.gloves,
			boots: logininfo.boots,
			unk0: 0,
			ring1: 0,
			ring2: 0,
			innerwear: logininfo.innerwear,
			appearance: require('long').fromString(logininfo.appearance.toString()),
			unk1: 0,
			unk2: 0,
			unk3: 0,
			unk4: 0,
			unk5: 0,
			unk6: 0,
			unk7: 0,
			unk8: 0,
			unk9: 0,
			unk10: 0,
			unk11: 0,
			unk12: 0,
			unk13: 0,
			unk14: 0,
			unk15: 0,
			unk16: 0,
			unk17: 0,
			unk18: 0,
			unk19: 0,
			unk20: 0,
			unk21: 0,
			unk22: 0,
			unk23: 0,
			unk24: logininfo.weaponEnchantment, // enchantment
			unk25: 100,
			item: 168013, // Appearance Change Voucher
			details: Buffer.from(logininfo.details.toString('hex'), 'hex'),
			details2: Buffer.from(logininfo.details2.toString('hex'), 'hex')
		})
		inAppearanceChange = true
	}
	
	function voiceChange(voicelevel) {
		if(voicelevel < 0 || voicelevel > 5) {
			message('Please choose a voice id between 0 and 5')
			return
		}
		else {
			if(gender == 1 && voicelevel == 5) voicelevel = 4 // females have 1 voice less
			dispatch.toClient('S_CHANGE_VOICE_USE_QAC', 1, {
				voice: voicelevel
			})
		}
	}
	
	function resetMe() {
		removeAppearanceChange(cid, CHEST_ID, 4)
		removeAppearanceChange(cid, GROW_ID, 4)
		removeAppearanceChange(cid, THIGH_ID, 4)

		if (marrowstate) { marrowstate = false; removeAppearanceChange(cid, MARROW_ID, 1) }
		if (lachestate) { lachestate = false; removeAppearanceChange(cid, LACHE_ID, 1) }
		if (miwingstate) { miwingstate = false; removeAppearanceChange(cid, MIWINGS_ID, 1) }
		if (mistate) { mistate = false; removeAppearanceChange(cid, MI_ID, 1) }
		if (chillstate) { chillstate = false; removeAppearanceChange(cid, DCHILL_ID, 1) }
		if (firestate) { firestate = false; removeAppearanceChange(cid, DFIRE_ID, 1) }
		if (ragstate) { ragstate = false; removeAppearanceChange(cid, RAG_ID, 1) }
		if (reapstate) { reapstate = false; removeAppearanceChange(cid, REAP_ID, 1) }
		if (darkanstate) { darkanstate = false; removeAppearanceChange(cid, DARKAN_ID, 1) }
		if (noctstate) { noctstate = false; removeAppearanceChange(cid, NOCT_ID, 1) }
		
		if(imnotmyself) {
			imnotmyself = false
			changeme = false
			relogByName(player)
		}
	}
	
	function restoreEffect() {
		clearTimeout(timeout)
		if (marrowstate) applyAppearanceChange(cid, MARROW_ID, 1)
		if (lachestate) applyAppearanceChange(cid, LACHE_ID, 1)
		if (miwingstate) applyAppearanceChange(cid, MIWINGS_ID, 1)
		if (mistate) applyAppearanceChange(cid, MI_ID, 1)
		if (chillstate) applyAppearanceChange(cid, DCHILL_ID, 1)
		if (firestate) applyAppearanceChange(cid, DFIRE_ID, 1)
		if (ragstate) applyAppearanceChange(cid, RAG_ID, 1)
		if (reapstate) applyAppearanceChange(cid, REAP_ID, 1)
		if (darkanstate) applyAppearanceChange(cid, DARKAN_ID, 1)
		if (noctstate) applyAppearanceChange(cid, NOCT_ID, 1)
	}
	
	function applyAppearanceChange(cid, shapeid, stack) {
		dispatch.toClient('S_ABNORMALITY_BEGIN', 2, {
			target: cid,
			source: cid,
			id: shapeid,
			duration: 864000000,
			unk: 0,
			stacks: stack,
			unk2: 0,
		})
	}
	
	function removeAppearanceChange(cid, shapeid, stack) {
		dispatch.toClient('S_ABNORMALITY_BEGIN', 2, {
			target: cid,
			source: cid,
			id: shapeid,
			duration: 864000000,
			unk: 0,
			stacks: stack,
			unk2: 0,
		})
		dispatch.toClient('S_ABNORMALITY_END', 1, {
			target: cid,
			id: shapeid,
		})
	}
	
	function getModel(race, gender, job) {
		let newmodel = 0
		
		switch(race) {
			case 0:
				newmodel += 10100
				break
			case 1:
				newmodel += 10300
				break
			case 2:
				newmodel += 10500
				break
			case 3:
				newmodel += 10700
				break
			case 4:
				newmodel += 10900
				break
			case 5:
				newmodel += 11100
				break
		}
			
		if(gender == 1) newmodel += 100
				
		newmodel += job + 1
		
		return newmodel
	}
	
	// ################# //
	// ### Chat Hook ### //
	// ################# //
	
	const command = Command(dispatch)
	command.add('surgeon', (param, number) => {
		if (param == 'load' && number != null) {
			if(number >= customApp.length) command.message('Invalid Preset. Does not exist.')
			else {
				forced = true
				forcedVal = arg
				currJob = job
				command.message('Relogging to change apperance to preset ' + forcedVal + ' in 5 seconds.')
				setTimeout(() => { relogByName(player) }, 5000)
			}
		}
		else if (param == 'race') raceChange()
		else if (param == 'gender') genderChange()
		else if (param == 'appearance') appearanceChange()
		else if (param == 'reset') resetMe()
		else if (param == 'voice' && number != null) voiceChange(Number(number))
		else if (param == 'head') {
			shapeid = HEAD_ID
			stack = 1
			if(!headstate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			headstate = !headstate
		}
		else if (param == 'height' && number != null) {
			shapeid = GROW_ID
			stack = Number(number) + 4
			if(stack == 4) removeAppearanceChange(cid, shapeid, stack)
			else applyAppearanceChange(cid, shapeid, stack)
		}
		else if (param == 'thighs' && number != null) {
			shapeid = THIGH_ID
			stack = Number(number) + 4
			if(stack == 4) removeAppearanceChange(cid, shapeid, stack)
			else applyAppearanceChange(cid, shapeid, stack)
		}
		else if (param == 'chest') {
			shapeid = CHEST_ID
			stack = Number(number) + 4
			if(stack == 4) removeAppearanceChange(cid, shapeid, stack)
			else applyAppearanceChange(cid, shapeid, stack)
		}
		else if (param == 'marrow' && number != null) {
			shapeid = MARROW_ID
			stack = 1
			if(!marrowstate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			marrowstate = !marrowstate
		}
		else if (param == 'darkan') {
			shapeid = DARKAN_ID
			stack = 1
			if(!darkanstate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			darkanstate = !darkanstate
		}
		else if (param == 'darkan2') {
			shapeid = MIWINGS_ID
			stack = 1
			if(!miwingstate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			miwingstate = !miwingstate
		}
		else if (param == 'ice') {
			shapeid = DCHILL_ID
			stack = 1
			if(!chillstate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			chillstate = !chillstate
		}
		else if (param == 'fire') {
			shapeid = DFIRE_ID
			stack = 1
			if(!firestate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			firestate = !firestate
		}
		else if (param == 'lachelith') {
			shapeid = LACHE_ID
			stack = 1
			if(!lachestate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			lachestate = !lachestate
		}
		else if (param == 'murderous') {
			shapeid = MI_ID
			stack = 1
			if(!mistate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			mistate = !mistate
		}
		else if (param == 'ragnarok') {
			shapeid = RAG_ID
			stack = 1
			if(!ragstate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			ragstate = !ragstate
		}
		else if (param == 'reaping') {
			shapeid = REAP_ID
			stack = 1
			if(!reapstate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			reapstate = !reapstate
		}
		else if (param == 'noctenium') {
			shapeid = NOCT_ID
			stack = 1
			if(!noctstate) applyAppearanceChange(cid, shapeid, stack)
			else removeAppearanceChange(cid, shapeid, stack)
			noctstate = !noctstate
		}
		else command.message('Commands:<br>'
								+ ' "surgeon load [x]" (load your saved preset with the number x, e.g. "surgeon load 0"),<br>'
								+ ' "surgeon race" (emulates a race change),<br>'
								+ ' "surgeon gender" (emulates a gender change),<br>'
								+ ' "surgeon appearance" (emulates an appearance change),<br>'
								+ ' "surgeon reset" (resets your changes),<br>'
								+ ' "surgeon voice [0-5]" (changes your voice pitch, e.g. "surgeon voice 1"),<br>'
								+ ' "surgeon head" (switch between big and normal head),<br>'
								+ ' "surgeon height [x]" (changes your height to x, default is 0, e.g. "surgeon height -3"),<br>'
								+ ' "surgeon thighs [x]" (changes your thighs to x, default is 0, e.g. "surgeon thighs -3"),<br>'
								+ ' "surgeon chest [x]" (changes your chest to x, default is 0, e.g. "surgeon chest -3"),<br>'
								+ ' "surgeon marrow" (gives you the Marrow Brooch visual effect),<br>'
								+ ' "surgeon darkan" (gives you Darkan\'s wings),<br>'
								+ ' "surgeon darkan2" (gives you Darkan\'s wings and Murderous Intent visual effects),<br>'
								+ ' "surgeon ice" (gives you Kelsaik\'s ice visual effect),<br>'
								+ ' "surgeon fire" (gives you Kelsaik\'s fire visual effect),<br>'
								+ ' "surgeon lachelith" (gives you Lachelith\'s debuff visual effect),<br>'
								+ ' "surgeon murderous" (gives you the Murderous Intent visual effect),<br>'
								+ ' "surgeon ragnarok" (gives you the Ragnarok visual effect),<br>'
								+ ' "surgeon reaping" (gives you the Shadow Reaping visual effect),<br>'
								+ ' "surgeon noctenium" (gives you the Uncommon Noctenium visual effect)'
			)
	})
	
	function saveCustom() {
		fs.writeFileSync(path.join(__dirname, 'app.json'), JSON.stringify(customApp))
	}
	
	// --------------------------------------------- relog by wuaw
	
	function relogByName(name) {
		if (!name) return
		getCharacterId(name)
		  .then(relog)
		  .catch(e => console.error(e.message))
	  }

	function getCharacterId(name) {
		return new Promise((resolve, reject) => {
			// request handler, resolves with character's playerId
			const userListHook = dispatch.hookOnce('S_GET_USER_LIST', 1, event => {
				event.characters.forEach(char => {
					if (char.name.toLowerCase() === name.toLowerCase())
					resolve(char.id)
				})
				reject(new Error(`[Surgeon] Character "${name}" not found`))
			})

			// set a timeout for the request, in case something went wrong
			setTimeout(() => {
				if (userListHook) dispatch.unhook(userListHook)
				reject(new Error('[Surgeon] C_GET_USER_LIST request timed out'))
			}, 5000)

			// request the character list
			dispatch.toServer('C_GET_USER_LIST', 1, {})
		})
	}

	function relog(targetId) {
		if (!targetId) return
		dispatch.toServer('C_RETURN_TO_LOBBY', 1, {})
		let userListHook
		let lobbyHook

		// make sure that the client is able to log out
		const prepareLobbyHook = dispatch.hookOnce('S_PREPARE_RETURN_TO_LOBBY', 1, () => {
			dispatch.toClient('S_RETURN_TO_LOBBY', 1, {})

			// the server is not ready yet, displaying "Loading..." as char names
			userListHook = dispatch.hookOnce('S_GET_USER_LIST', 1, event => {
				event.characters.forEach(char => char.name = 'Loading...')
				return true
			})

			// the server is ready to relog to a new character
			lobbyHook = dispatch.hookOnce('S_RETURN_TO_LOBBY', 1, () => {
				dispatch.toServer('C_SELECT_USER', 1, { id: targetId, unk: 0 })
			})
		})

		// hook timeout, in case something goes wrong
		setTimeout(() => {
		for (const hook of [prepareLobbyHook, lobbyHook, userListHook])
			if (hook) dispatch.unhook(hook)
		}, 15000)
	}
}