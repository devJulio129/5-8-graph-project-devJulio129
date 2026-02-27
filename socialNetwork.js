// Social Network Starter File
// Based on the README instructions
// Implement the functions below using the step-by-step guidance

// Data Structure: Adjacency list with details
const network = {
  smo: {
    details: { name: "Smo", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["palvreet", "brian"]
  },
  palvreet: {
    details: { name: "Palvreet", city: "Toronto", bio: "Likes basketball", school: "", company: "" },
    friends: ["smo", "cory", "jasmine"]
  },
  cory: {
    details: { name: "Cory", city: "Montreal", bio: "", school: "", company: "" },
    friends: ["palvreet", "brian"]
  },
  brian: {
    details: { name: "Brian", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["smo", "cory"]
  },
  jasmine: {
    details: { name: "Jasmine", city: "Toronto", bio: "", school: "", company: "" },
    friends: ["palvreet"]
  }
};

// createNetwork function
function createUser(name, city, bio, school, company) {
   return {
     details: { name: name, city: city, bio: bio, school: school, company: company },
     friends: []
   }
}


// Core Feature A — Add Friendship
function addFriendship(network, user1, user2) {
  // 1. Check if user1 exists in the network. If not, create a new entry with default details and empty friends array.
  // 2. Check if user2 exists in the network. If not, create a new entry with default details and empty friends array.
  // 3. If user2 is not already in user1's friends list, add it.
  // 4. If user1 is not already in user2's friends list, add it.

  if(!network[user1]) { 
    network[user1] = createUser(user1, 'unknown', '', '', '')
  }
  if(!network[user2]) { 
    network[user2] = createUser(user2, 'unknown', '', '', '')
  }

  if(!network[user1].friends.includes(user2)) {
    network[user1].friends.push(user2)
  }
  if(!network[user2].friends.includes(user1)) {
    network[user2].friends.push(user1)
  }
}

// Core Feature B — Suggest Friends (Friends-of-Friends)
function suggestFriends(network, personId) {
  // 1. If personId doesn't exist, return an empty list.
  // 2. Create a structure to count mutuals, e.g.: counts = {} where keys are candidate IDs and values are counts
  // 3. Loop through each direct friend of personId.
  // 4. For each direct friend, loop through their friends (friends-of-friends).
  // 5. For each candidate:
  //    - If candidate is the user → skip
  //    - If candidate is already a direct friend → skip
  //    - Otherwise: Increase their count in counts
  // 6. Convert counts into an array of { id, mutualCount }.
  // 7. Sort it by mutualCount descending.
  // 8. Return the sorted array.
  if(!network[personId]){
    console.log('Empty list')
    return [];
  }
   const counts = {}  // { candidateId: numberOfMutuals }
  const directFriends = network[personId].friends;


  //Loop through each direct friend
   for(let i = 0; i < directFriends.length; i++){
    const friend = directFriends[i];
    const friendsOfFriends = network[friend].friends;

  //Loop throught friends-of-friends
    for(let j= 0; j < friendsOfFriends.length; j++){
      const candidate = friendsOfFriends[j];


    // Skip if it's me or already my friend
      if(candidate === personId) continue;
      if(directFriends.includes(candidate)) continue;

    //Count this mutual connection
      if(!counts[candidate]) {
        counts[candidate] = 0;
      }
      counts[candidate]++;
      }
   }

    // Convert to array and sort
   const result = [];
   for (const id in counts) {
    result.push({ id: id, mutualCount: counts[id] });
   }
   result.sort((a , b) => b.mutualCount - a.mutualCount);

   return result
}


// Core Feature C — People You May Know (Filters)
function peopleYouMayKnow(network, personId, options) {
  // 1. Start by generating suggestions with mutual counts (same logic as suggestFriends).
  // 2. Loop over the suggestions and apply filters using if/else:
  //    - if mutualCount < minMutualFriends → skip
  //    - if sameCityOnly and cities don't match → skip
  //    - if candidate in excludeList → skip
  // 3. Return the filtered results (keep sorting by mutualCount).

 const suggestions = suggestFriends(network, personId);
 
 const minMutualFriends = options.minMutualFriend || 0;
 const sameCityOnly = options.sameCity || false;
 const excludeList = options.excludeList || [];

 const filtered = [];

 for(let i = 0; i < suggestions.length; i++) {
  const suggestion = suggestions[i];

  if(suggestion.mutualCount < minMutualFriends) continue;

  if (sameCityOnly) {
    const myCity = network[personId].details.city;
    const theirCity = network[suggestion.id].details.city;
    if(myCity !== theirCity) continue;
  }
  if (excludeList.includes(suggestion.id)) continue;

  filtered.push(suggestion);
 }

 return filtered;
}

// Core Feature D — Profile Completeness
function profileCompleteness(network, personId) {
  // 1. If person doesn't exist, return 0.
  // 2. Start score at 0.
  // 3. Use if/else checks for each rule and add points.
  // 4. Return final score.
  if(!network[personId]) return 0;

  let score= 0;
  const person = network[personId];

  if(person.details.name) score += 20;
  if(person.details.city) score += 20;
  if(person.friends && person.friends.length > 0) score += 20;
  if(person.details.school) score += 20;
  if(person.details.bio) score += 20;

  return score
}

// Example usage (uncomment to test)
console.log("Initial network:", network);
addFriendship(network, "smo", "cory");
console.log("After adding friendship:", network);
console.log("Suggestions for smo:", suggestFriends(network, "jasmine"));
console.log("Filtered suggestions:", peopleYouMayKnow(network, "brian", { minMutualFriends: 2, sameCityOnly: true }));
console.log("Profile completeness for smo:", profileCompleteness(network, "palvreet"));