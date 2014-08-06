**********
GeoWidgets
**********

Yet Another Set of Geowidgets for GeoDjango?

Not yet, there is only one widget that gives you a geocoding point field.

To add a geocoding point widget that asks Google to find the location for you:

.. code-block:: python

    from geowidgets.forms import GeocodeSuggestPointField

    class YourPersonForm(forms.Form):

        location = GeocodeSuggestPointField()


This will give you a form that looks like `this <http://skyl.github.io/geowidgets/>`_.

This is not yet on PyPi. But, you can checkout the repo and `setup.py install`.
