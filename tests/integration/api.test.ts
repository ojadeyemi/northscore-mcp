/**
 * Integration tests - Real API calls
 * Run with: pnpm test:integration
 */

import fetchGames from '@/services/games.js';
import fetchStandings from '@/services/standings.js';
import fetchLeaderboard from '@/services/leaderboard.js';
import fetchTeamStats from '@/services/team-stats.js';
import fetchTeamInfo from '@/services/team-info.js';
import fetchTeamRoster from '@/services/team-roster.js';
import fetchTeamComparison from '@/services/team-comparison.js';

async function testApiClient() {
  console.log('🧪 Testing Northscore API Client...\n');

  try {
    // Test 1: Fetch CEBL games
    console.log('1️⃣  Fetching CEBL games...');
    const ceblGames = await fetchGames('cebl');
    console.log(`   ✅ Success! Retrieved ${ceblGames.length} CEBL games`);
    if (ceblGames.length > 0) {
      console.log(
        `   📋 Sample: ${ceblGames[0]?.home_team.name} vs ${ceblGames[0]?.away_team.name}\n`,
      );
    }

    // Test 2: Fetch CEBL standings
    console.log('2️⃣  Fetching CEBL standings...');
    const ceblStandings = await fetchStandings('cebl');
    console.log(`   ✅ Success! Retrieved ${ceblStandings.length} team standings`);
    if (ceblStandings.length > 0) {
      console.log(
        `   📋 Sample: ${ceblStandings[0]?.team_name} - ${ceblStandings[0]?.wins}W ${ceblStandings[0]?.losses}L\n`,
      );
    }

    // Test 3: Fetch CEBL leaderboard
    console.log('3️⃣  Fetching CEBL leaderboard...');
    const ceblLeaderboard = await fetchLeaderboard('cebl');
    console.log(`   ✅ Success! Retrieved ${ceblLeaderboard.length} player stats`);
    if (ceblLeaderboard.length > 0) {
      console.log(
        `   📋 Sample: ${ceblLeaderboard[0]?.player_name} - ${ceblLeaderboard[0]?.stat_type}: ${ceblLeaderboard[0]?.value}\n`,
      );
    }

    // Test 4: Fetch CEBL team stats
    console.log('4️⃣  Fetching CEBL team stats (Calgary)...');
    const teamStats = await fetchTeamStats('cebl', { team_name: 'calgary' });
    if (!Array.isArray(teamStats)) {
      console.log(`   ✅ Success! Retrieved stats for ${teamStats.team_name}`);
      console.log(`   📋 Games played: ${teamStats.games_played}\n`);
    } else {
      console.log(`   ✅ Success! Retrieved ${teamStats.length} team stats\n`);
    }

    // Test 5: Fetch CEBL team info
    console.log('5️⃣  Fetching CEBL team info (Calgary)...');
    const teamInfo = await fetchTeamInfo('cebl', 'calgary');
    console.log(`   ✅ Success! Retrieved info for ${teamInfo.team_name}`);
    console.log(`   📋 Record: ${teamInfo.wins}W - ${teamInfo.losses}L\n`);

    // Test 6: Fetch U SPORTS MBB games
    console.log('6️⃣  Fetching U SPORTS MBB games...');
    const usportsGames = await fetchGames('usports_mbb');
    console.log(`   ✅ Success! Retrieved ${usportsGames.length} U SPORTS MBB games\n`);

    // Test 7: Fetch U SPORTS standings
    console.log('7️⃣  Fetching U SPORTS MBB standings...');
    const usportsStandings = await fetchStandings('usports_mbb');
    console.log(`   ✅ Success! Retrieved ${usportsStandings.length} U SPORTS team standings\n`);

    // Test 8: Fetch U SPORTS leaderboard
    console.log('8️⃣  Fetching U SPORTS MBB leaderboard...');
    const usportsLeaderboard = await fetchLeaderboard('usports_mbb');
    console.log(`   ✅ Success! Retrieved ${usportsLeaderboard.length} U SPORTS player stats\n`);

    // Test 9: Fetch CFL games
    console.log('9️⃣  Fetching CFL games...');
    const cflGames = await fetchGames('cfl');
    console.log(`   ✅ Success! Retrieved ${cflGames.length} CFL games`);
    if (cflGames.length > 0) {
      console.log(
        `   📋 Sample: ${cflGames[0]?.home_team.name} vs ${cflGames[0]?.away_team.name}\n`,
      );
    }

    // Test 10: Fetch CFL standings
    console.log('🔟 Fetching CFL standings...');
    const cflStandings = await fetchStandings('cfl');
    console.log(`   ✅ Success! Retrieved ${cflStandings.length} CFL team standings\n`);

    // Test 11: Fetch CEBL team roster
    console.log('1️⃣1️⃣ Fetching CEBL team roster (Calgary)...');
    const ceblRoster = await fetchTeamRoster('cebl', 'calgary');
    console.log(`   ✅ Success! Retrieved roster for ${ceblRoster.team_name}`);
    console.log(`   📋 Players: ${ceblRoster.players.length}\n`);

    // Test 12: Fetch U SPORTS team roster
    console.log('1️⃣2️⃣ Fetching U SPORTS MBB team roster (Carleton)...');
    const usportsRoster = await fetchTeamRoster('usports_mbb', 'Carleton');
    console.log(`   ✅ Success! Retrieved roster for ${usportsRoster.team_name}`);
    console.log(`   📋 Players: ${usportsRoster.players.length}\n`);

    // Test 13: Fetch CEBL team comparison
    console.log('1️⃣3️⃣ Fetching CEBL team comparison (Calgary vs Edmonton)...');
    const ceblComparison = await fetchTeamComparison('cebl', {
      team1: 'calgary',
      team2: 'edmonton',
    });
    console.log(`   ✅ Success! Retrieved comparison`);
    if ('teams' in ceblComparison) {
      console.log(
        `   📋 Team 1: ${ceblComparison.teams.team1.team_name}, Team 2: ${ceblComparison.teams.team2.team_name}\n`,
      );
    } else {
      console.log(
        `   📋 Team 1: ${ceblComparison.team1.team_name}, Team 2: ${ceblComparison.team2.team_name}\n`,
      );
    }

    // Test 14: Fetch U SPORTS team comparison (college leagues return different structure)
    console.log('1️⃣4️⃣ Fetching U SPORTS team comparison (Carleton vs Ottawa)...');
    const usportsComparison = await fetchTeamComparison('usports_mbb', {
      team1: 'Carleton',
      team2: 'Ottawa',
    });
    console.log(`   ✅ Success! Retrieved comparison`);
    if ('teams' in usportsComparison) {
      console.log(
        `   📋 Team 1: ${usportsComparison.teams.team1.team_name}, Team 2: ${usportsComparison.teams.team2.team_name}\n`,
      );
    } else {
      console.log(
        `   📋 Team 1: ${usportsComparison.team1.team_name}, Team 2: ${usportsComparison.team2.team_name}\n`,
      );
    }

    console.log('✅ All API tests passed!\n');
    console.log('📊 Summary:');
    console.log(`   - CEBL games: ✓`);
    console.log(`   - CEBL standings: ✓`);
    console.log(`   - CEBL leaderboard: ✓`);
    console.log(`   - CEBL team stats: ✓`);
    console.log(`   - CEBL team info: ✓`);
    console.log(`   - CEBL team roster: ✓`);
    console.log(`   - CEBL team comparison: ✓`);
    console.log(`   - U SPORTS games: ✓`);
    console.log(`   - U SPORTS standings: ✓`);
    console.log(`   - U SPORTS leaderboard: ✓`);
    console.log(`   - U SPORTS team roster: ✓`);
    console.log(`   - U SPORTS team comparison: ✓`);
    console.log(`   - CFL games: ✓`);
    console.log(`   - CFL standings: ✓`);
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

await testApiClient();
