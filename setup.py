from setuptools import setup, find_packages

version = '0.1'
LONG_DESCRIPTION = """
=====================================
GeoWidgets
=====================================

Plural is forward-looking, right now there is one geocode-suggest widget.
"""

setup(
    name="geowidgets",
    version=version,
    description="geowidgets",
    long_description=LONG_DESCRIPTION,
    classifiers=[
        "Programming Language :: Python",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ],
    keywords='python',
    author='Skylar Saveland',
    author_email='skylar.saveland@gmail.com',
    url='http://github.com/skyl/geowidgets',
    license='MIT',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
)
