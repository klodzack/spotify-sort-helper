import { CsvOutput } from './outputs/CsvOutput';
import { Song } from './processing/Song';
import { SongList } from './processing/SongList';

(async () => {
    /*
    const list = await SongList.fromSongs([
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
    ]);
    */
    const list = await SongList.fromCsvFile(new URL('examples/example.csv', 'file:' + __dirname));
    const out = new CsvOutput(new URL('out.csv', 'file:' + __dirname));
    await out.write((async function* getOriginalNode() {
        for (const song of list.songs) {
            yield {
                title: song.title,
                album: song.album,
                artist: song.artist,
                genres: await song.getGenres(),
            };
        }
    })());
    /*
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
        */
})().catch(e => {
    console.error(e);
    process.exit(1);
});
