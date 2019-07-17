module.exports = {
    dependency: {
        platforms: {
            android: {
                packageImportPath: 'import com.zinspector.foregroundservice.ForegroundServicePackage;',
                packageInstance: 'new ForegroundServicePackage()',
            },
        },
    },
};