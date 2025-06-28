import { Song } from './Song';
import { SongList } from './SongList';

(async () => {
    const list = new SongList([
        /*
        new Song('I Want to Hold Your Hand', 'The Beatles'),
        new Song('A Hard Day\'s Night', 'The Beatles'),
        new Song('Day Tripper', 'The Beatles'),
        new Song('Ticket To Ride', 'The Beatles'),
        new Song('Because', 'The Beatles'),
        new Song('Back in the U.S.S.R.', 'The Beatles'),
        new Song('Birthday', 'The Beatles'),
        new Song('Blackbird', 'The Beatles'),
        */
        new Song('Boys', 'The Beatles'),
        /*
        new Song('Daydream', 'The Lovin\' Spoonful'),
        new Song('Daydream Believer', 'The Monkees'),
        */
    ]);
    const { genres, unknownSongs } = await list.getGenres();
    for (const genre of genres) {
        console.log(`Genre: ${genre.genre}`);
        for (const song of genre.songs) {
            console.log(`  - ${song.title} by ${song.artist}`);
        }
    }
    if (unknownSongs.length) {
        console.log('Unknown songs:');
        for (const song of unknownSongs) {
            console.log(`  - ${song.title} by ${song.artist}`);
        }
    }
})().catch(e => {
    console.error(e);
    process.exit(1);
});
