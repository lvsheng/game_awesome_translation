define(['./resourceFileMap'], function (resourceFileMap) {
    var resourceFilePathList = {};

    for (var game in resourceFileMap) {
        resourceFilePathList[game] = [];
        for (var fileName in resourceFileMap[game]) {
            resourceFilePathList[game].push(resourceFileMap[game][fileName]);
        }
    }

    return resourceFilePathList;
});
