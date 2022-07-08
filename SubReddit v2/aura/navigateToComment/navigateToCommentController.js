({

    init: function(cmp, evt, helper) {
        var myPageRef = cmp.get("v.pageReference");
        var postId = myPageRef.state.c__postId;
        var postName = myPageRef.state.c__postName;
        cmp.set("v.postId", postId);
        cmp.set("v.postName", postName);

    },
    reInit : function(component, event, helper) {
        $A.get('e.force:refreshView').fire();
    }

})