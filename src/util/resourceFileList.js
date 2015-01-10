define(['./resourceFileMap'], function (resourceFileMap) {
    var resourceFilePathList = {};

    for (var game in resourceFileMap) {
        resourceFilePathList[game] = [];
        for (var fileName in resourceFileMap[game]) {
            if (_.isObject(resourceFileMap[game][fileName])) {
                var groupName = fileName;
                var group = resourceFileMap[game][groupName];
                resourceFilePathList[game][groupName] = [];
                for (fileName in group) {
                    resourceFilePathList[game].push(group[fileName]);
                    resourceFilePathList[game][groupName].push(group[fileName]);
                }
            } else {
                resourceFilePathList[game].push(resourceFileMap[game][fileName]);
            }
        }
    }

    return resourceFilePathList;
});
