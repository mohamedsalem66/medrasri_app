import * as FileSystem from 'expo-file-system';
import {EncodingType} from 'expo-file-system';
import Environement from "../constants/Environement";
import {shareAsync} from 'expo-sharing';
import {isAndroid} from "../constants/PlatformConsts";
import * as MediaLibrary from 'expo-media-library';
import {Toast} from "../components/Toast";
import {IMLocalized} from "../utils/Translater";
import * as Application from 'expo-application';

export const useDownloadFile = () => {

    const downloadFile = async (url?) => {

        console.log(FileSystem.documentDirectory);


        try {
            // FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(FileSystem.documentDirectory)
            const appDir = FileSystem.documentDirectory + Environement.appFolder + '/';

            const metaDataDir = await FileSystem.getInfoAsync(appDir);
            const isDir = metaDataDir.exists;
            if (!isDir) {
                await FileSystem.makeDirectoryAsync(
                    appDir,
                    {intermediates: true}
                );
            }

            const fileName = appDir + 'sample.pdf';
            await FileSystem.downloadAsync(
                'http://www.africau.edu/images/default/sample.pdf',
                fileName
            )
                .then(async ({uri}) => {
                    console.log('Finished downloading to ', uri);
                    await shareAsync(uri, {UTI: '.pdf', mimeType: 'application/pdf'});
                })
                .catch(error => {
                    console.error(error);
                });

            /*const {status} = await MediaLibrary.requestPermissionsAsync();
            if (status === "granted") {
                const asset = await MediaLibrary.createAssetAsync(fileName);
                await MediaLibrary.getAlbumAsync(Application.applicationName)
                    .then(async () =>
                        await MediaLibrary.createAlbumAsync(Application.applicationName, asset, false))
                    .catch(
                        async () => await MediaLibrary.addAssetsToAlbumAsync(asset, Application.applicationName, false));
            }*/
        } catch (e) {
            console.info("ERROR", e);
        }
    }

    const writeFile = async (b64, name) => {
        try {
            let appDir = `${FileSystem.documentDirectory}${Environement.appFolder}/`;
            const metaDataDir = await FileSystem.getInfoAsync(appDir);

            const isDir = metaDataDir.exists;
            if (!isDir) {
                await FileSystem.makeDirectoryAsync(
                    appDir,
                    {intermediates: true}
                );
            }
            const fileName = `${appDir}${name}.pdf`;

            await FileSystem.writeAsStringAsync(
                fileName,
                b64,
                {
                    encoding: EncodingType.Base64
                }
            )
                .then(async () => {
                    if (isAndroid()) {
                        const {status} = await MediaLibrary.requestPermissionsAsync();
                        if (status === "granted") {
                            const asset = await MediaLibrary.createAssetAsync(fileName);
                            Toast(IMLocalized(`File downloaded successfully`))
                            await MediaLibrary.getAlbumAsync(Application.applicationName)
                                .then(async () =>
                                    await MediaLibrary.createAlbumAsync(Application.applicationName, asset, false))
                                .catch(
                                    async () => await MediaLibrary.addAssetsToAlbumAsync(asset, Application.applicationName, false));
                        }
                    }
                    await shareAsync(fileName, {UTI: '.pdf', mimeType: 'application/pdf'});
                })
                .catch(error => {
                    console.error(error);
                });
        } catch (e) {
            console.info("ERROR", e);
        }
    }


    return {
        downloadFile,
        writeFile
    }
}
