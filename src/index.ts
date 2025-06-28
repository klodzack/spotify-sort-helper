import { Song } from './Song';
import { SongList } from './SongList';

(async () => {
    const list = new SongList([
        new Song('I Want to Hold Your Hand', 'Meet the Beatles!', 'The Beatles'),
        new Song('A Hard Day\'s Night', 'A Hard Day\'s Night', 'The Beatles'),
        new Song('Day Tripper', 'Rubber Soul', 'The Beatles'),
        new Song('Ticket To Ride', 'Help!', 'The Beatles'),
        new Song('Because', 'Abbey Road', 'The Beatles'),
        new Song('Back in the U.S.S.R.', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('Birthday', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('Blackbird', 'The Beatles (The White Album)', 'The Beatles'),
        new Song('Please Please Me', 'Please Please Me', 'The Beatles'),
        new Song('Boys', 'Please Please Me', 'The Beatles'),
        new Song('Daydream', 'Daydream', 'The Lovin\' Spoonful'),
        new Song('Daydream Believer', 'The Birds, The Bees & The Monkees', 'The Monkees'),
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
