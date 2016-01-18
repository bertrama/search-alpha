// Copyright (c) 2016, Regents of the University of Michigan.
// All rights reserved. See LICENSE.txt for details.

// Authored by Jon Earley (earleyj@umich.edu)

var app = app || {};

app.selected_facets = m.prop()

app.Facets = {
  controller: function() {
    this.facets = function() {
      var uid = app.getSelectedDatastore()

      if (uid) { 
        var data = app.data()
        return data[uid].facets
      } else {
        return undefined
      }
    }
    this.select = function(facet_uid, value) {
      var selected_facets = app.selected_facets()
      var datastore_uid = app.getSelectedDatastore()

      if (!selected_facets) {
        selected_facets = {}
      }

      setValue(selected_facets, datastore_uid + "." + facet_uid, value)
      app.selected_facets(selected_facets)
    }
    this.isSelected = function(facet_uid, result_value) {
      var selected_facets = app.selected_facets() 
      var datastore_uid = app.getSelectedDatastore()

      // if there are selected facets
      if (selected_facets) { 

        // does the facet option match a selected facet
        if (result_value == selected_facets[datastore_uid][facet_uid]) {
          return true
        }
      }

      return false
    }
  },
  view: function(ctrl) {
    return m('div', [
      m('ul.facet-list', [
         _.map(ctrl.facets(), function(facet) {
          if (facet.results.length > 0) {

            return m('li.facet', [
              m('h4', facet.metadata.metadata.name),
              m('ul', [
                _.map(facet.results, function(result) {
                  var selected_class = ""

                  if (ctrl.isSelected(facet.metadata.uid, result.value)) {
                    selected_class = '.selected'
                  }

                  return m('li[data-facet_uid="' + facet.metadata.uid + '"][data-facet_value="' + result.value + '"]' + selected_class + '', {
                    onclick: function(e) {
                      ctrl.select(facet.metadata.uid, e.target.dataset.facet_value)
                    }
                  }, result.name + " (" + result.count + ")")
                })
              ])
            ])
          }
        })
      ])
    ])
  }
}