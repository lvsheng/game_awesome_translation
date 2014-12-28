define(['./resourceFileMap'], function (resourceFileMap) {
    var resourceFilePathList = {};

    for (var game in resourceFileMap) {
        resourceFilePathList[game] = [];
        for (var fileName in resourceFileMap[game]) {
            if (_.isObject(resourceFileMap[game][fileName])) {
                var group = resourceFileMap[game][fileName];
                for (fileName in group) {
                    resourceFilePathList[game].push(group[fileName]);
                }
            } else {
                resourceFilePathList[game].push(resourceFileMap[game][fileName]);
            }
        }
    }

    return resourceFilePathList;
});
