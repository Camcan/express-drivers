var driversJobs = angular.module('driversJobs', []);

function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

driversJobs.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
});



function mainController($scope, $http) {
    $scope.sortAttr = 'altered'
    $scope.descend = false

    $scope.formData = {};
    $scope.jobForm = false
    // when landing on the page, get all todos and show them
    $http.get('/api/jobs')
        .success(function(data) {
            $scope.jobs = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createJob = function(a) {
        $http.post('/api/jobs', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.jobs = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };



    // delete a todo after checking it
    $scope.deleteJob = function(id) {
        console.log("Deleted Job: " + id)
        $http.delete('/api/jobs/' + id)
            .success(function(data) {
                $scope.jobs = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    $scope.updateJob = function(){
        var job = {}
        job._id = $scope.formData._id
        job.loc = $scope.formData.loc
        job.desc = $scope.formData.desc,
        job.details = $scope.formData.details
        job.sched =  $scope.formData.sched,
        job.assigned = $scope.formData.assigned || false,
        job.status = $scope.formData.assigned,
        job.assigned_to = $scope.formData.assigned_to || null,
        job.altered = Date.now(),
        console.log(job)
        // console.log(job.sched)
        $http.put('/api/jobs/'+ job._id, job)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.jobs = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    $scope.editJob = function(job) {
        $scope.formDatdea = job
        $scope.jobForm = true
        
    }
    $scope.toggleJobForm = function(){
        $scope.jobForm = !$scope.jobForm 
    }
    $scope.orderJobs = function(attr){
        if ($scope.sortAttr == attr) {
            $scope.descend = !$scope.descend
        } else {
            $scope.sortAttr = attr
        }
        console.log(attr)
    }
    $scope.filterBySearch = function(name) {
        if (!$scope.search) return true;
        var regex = new RegExp('\\b' + escapeRegExp($scope.search), 'i');
        return regex.test(name);
    };

}