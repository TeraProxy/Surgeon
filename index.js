// contains code from shape-changer by Spaacecats https://github.com/spaacecats
// contains code from relog by wuaw https://github.com/wuaw

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
		newappearance = -1,
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
		noctstate = false
		
	// ############# //
	// ### Magic ### //
	// ############# //
	
	dispatch.hook('S_LOGIN', 2, event => {
		if(changeme) { 
			event.appearance = newappearance
			event.model = getModel(newrace, newgender, job)
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
			newappearance = event.appearance
			imnotmyself = true
			changeme = true
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 1,
				unk: 0
			})
			relogByName(player)
			return false
		}
		else if(inGenderChange) {
			inGenderChange = false
			newrace = event.race
			if(event.gender == 0) newgender = 2
			else newgender = event.gender
			newappearance = event.appearance
			imnotmyself = true
			changeme = true
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 1,
				unk: 0
			})
			relogByName(player)
			return false
		}
		else if(inAppearanceChange) {
			inAppearanceChange = false
			newrace = event.race
			if(event.gender == 0) newgender = 2
			else newgender = event.gender
			newappearance = event.appearance
			imnotmyself = true
			changeme = true
			dispatch.toClient('S_END_CHANGE_USER_APPEARANCE', 1, {
				ok: 1,
				unk: 0
			})
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
			appearance: 0, // logininfo.appearance <- makes the client crash
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
			details: logininfo.details,
			details2: logininfo.details2
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
			appearance: 0, // logininfo.appearance <- makes the client crash
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
			details: logininfo.details,
			details2: logininfo.details2
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
			appearance: logininfo.appearance,
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
			details: logininfo.details,
			details2: logininfo.details2
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
	
	dispatch.hook('C_WHISPER', 1, (event) => {
		if(event.target.toUpperCase() === "!surgeon".toUpperCase()) {
			if (/^<FONT>race?<\/FONT>$/i.test(event.message)) {
				raceChange()
			}
			else if (/^<FONT>gender?<\/FONT>$/i.test(event.message)) {
				genderChange()
			}
			else if (/^<FONT>appearance?<\/FONT>$/i.test(event.message)) {
				appearanceChange()
			}
			else if (/^<FONT>reset?<\/FONT>$/i.test(event.message)) {
				resetMe()
			}
			else if (cmd = /^<FONT>voice (.+?)<\/FONT>$/i.exec(event.message)) {
				voice = Number(cmd[1])
				voiceChange(voice)
			}
			else if (/^<FONT>head?<\/FONT>$/i.test(event.message)) {
				shapeid = HEAD_ID
				if(headstate === false) {
					headstate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					headstate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (cmd = /^<FONT>height (.+?)<\/FONT>$/i.exec(event.message)) {
				shapeid = GROW_ID
				stack = Number(cmd[1]) + 4
				if (stack == 4){
					removeAppearanceChange(cid, shapeid, stack)
				}
				else {
					applyAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (cmd = /^<FONT>thighs (.+?)<\/FONT>$/i.exec(event.message)) {
				shapeid = THIGH_ID
				stack = Number(cmd[1]) + 4
				if (stack == 4){
					removeAppearanceChange(cid, shapeid, stack)
				}
				else {
					applyAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (cmd = /^<FONT>chest (.+?)<\/FONT>$/i.exec(event.message)) {
				shapeid = CHEST_ID
				stack = Number(cmd[1]) + 4
				if (stack == 4){
					removeAppearanceChange(cid, shapeid, stack)
				}
				else {
					applyAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>marrow?<\/FONT>$/i.test(event.message)) {
				shapeid = MARROW_ID
				if(marrowstate === false) {
					marrowstate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					marrowstate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>darkan?<\/FONT>$/i.test(event.message)) {
				shapeid = DARKAN_ID
				if(darkanstate === false) {
					darkanstate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					darkanstate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>darkan2?<\/FONT>$/i.test(event.message)) {
				shapeid = MIWINGS_ID
				if(miwingstate === false) {
					miwingstate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					miwingstate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>ice?<\/FONT>$/i.test(event.message)) {
				shapeid = DCHILL_ID
				if(chillstate === false) {
					chillstate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					chillstate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>fire?<\/FONT>$/i.test(event.message)) {
				shapeid = DFIRE_ID
				if(firestate === false) {
					firestate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					firestate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>lachelith?<\/FONT>$/i.test(event.message)) {
				shapeid = LACHE_ID
				if(lachestate === false) {
					lachestate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					lachestate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>murderous?<\/FONT>$/i.test(event.message)) {
				shapeid = MI_ID
				if(mistate === false) {
					mistate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					mistate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>ragnarok?<\/FONT>$/i.test(event.message)) {
				shapeid = RAG_ID
				if(mistate === false) {
					mistate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					mistate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>reaping?<\/FONT>$/i.test(event.message)) {
				shapeid = REAP_ID
				if(mistate === false) {
					mistate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					mistate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else if (/^<FONT>noctenium?<\/FONT>$/i.test(event.message)) {
				shapeid = NOCT_ID
				if(mistate === false) {
					mistate = true
					stack = 1
					applyAppearanceChange(cid, shapeid, stack)
				}	
				else {
					mistate = false
					stack = 1
					removeAppearanceChange(cid, shapeid, stack)
				}
			}
			else message('Commands:<br>'
								+ ' "race" (emulates a race change),<br>'
								+ ' "gender" (emulates a gender change),<br>'
								+ ' "appearance" (emulates an appearance change),<br>'
								+ ' "reset" (resets your changes),<br>'
								+ ' "voice [0-5]" (changes your voice pitch, e.g. voice 1),<br>'
								+ ' "head" (switch between big and normal head),<br>'
								+ ' "height [x]" (changes your height to x, default is 0, e.g. height -3),<br>'
								+ ' "thighs [x]" (changes your thighs to x, default is 0, e.g. thighs -3),<br>'
								+ ' "chest [x]" (changes your chest to x, default is 0, e.g. chest -3),<br>'
								+ ' "marrow" (gives you the Marrow Brooch visual effect),<br>'
								+ ' "darkan" (gives you Darkan\'s wings),<br>'
								+ ' "darkan2" (gives you Darkan\'s wings and Murderous Intent visual effects),<br>'
								+ ' "ice" (gives you Kelsaik\'s ice visual effect),<br>'
								+ ' "fire" (gives you Kelsaik\'s fire visual effect),<br>'
								+ ' "lachelith" (gives you Lachelith\'s debuff visual effect),<br>'
								+ ' "murderous" (gives you the Murderous Intent visual effect),<br>'
								+ ' "ragnarok" (gives you the Ragnarok visual effect),<br>'
								+ ' "reaping" (gives you the Shadow Reaping visual effect),<br>'
								+ ' "noctenium" (gives you the Uncommon Noctenium visual effect)'
						)
			return false
		}
	})
	
	function message(msg) {
		dispatch.toClient('S_WHISPER', 1, {
			player: cid,
			unk1: 0,
			gm: 0,
			unk2: 0,
			author: '!Surgeon',
			recipient: player,
			message: msg
		})
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